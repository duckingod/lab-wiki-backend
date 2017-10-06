'use strict'

const {modifyRecords, updateRecords} = require('../utils').model
const {listify, promise} = require('../utils')
const {daysAfter, toWeek} = require('../utils').date

module.exports = function (sequelize, DataTypes) {
  var Seminar = sequelize.define('Seminar', {
    presenter: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    topic: {
      type: DataTypes.STRING
    },
    slides: {
      type: DataTypes.STRING
    },
    owner: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    placeholder: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })

  /*
  Seminar.associate = function (models) {
    Seminar.hasMany(models.Slide)
  }
  */

  Seminar.prototype.copy = function () {
    return new Seminar({
      presenter: this.presenter,
      date: this.date,
      topic: this.topic,
      slides: this.slides,
      owner: this.owner,
      scheduleId: this.scheduleId,
      placeholder: this.placeholder
    })
  }

  Seminar.beforeUpdate(function (seminar, options) {
    seminar.placeholder = seminar.placeholder === 'keep' ? undefined : false
  })

  Seminar.futureSeminars = () =>
    Seminar.findAll({ where: { date: { $gte: new Date() } } })

  Seminar.futureSeminars = async fromDate => {
    const {ContactList} = require('../models')
    const {weeks} = require('../config').seminarSchedule
    let duties = await ContactList.dutyWithDate(
      'seminar',
      {
        nRound: weeks,
        nPerWeek: 2,
        fromDate: fromDate
      }
    )
    let seminars = listify(duties, presentation =>
      new Seminar({
        presenter: presentation.contact.name,
        owner: presentation.contact.account,
        date: presentation.date,
        scheduleId: presentation.id,
        topic: '.'
      })
    )
    return seminars
  }

  Seminar.postpone = async id => {
    const {dutyProp} = require('../utils').schedule
    const {Event} = require('../models')
    let dp = dutyProp('seminar')
    let seminar = await Seminar.findById(id)
    if (!seminar.placeholder) {
      throw new Error('Cannot postpone a non-placeholder seminar')
    }
    await new Event({ name: dp.event, meta: seminar.scheduleId }).save()
    let args = {
      where: {
        scheduleId: { $gte: seminar.scheduleId },
        placeholder: { $eq: true }
      }
    }
    let [seminars, newSeminars] = [await Seminar.findAll(args), await Seminar.futureSeminars(seminar.date)]
    seminars = await modifyRecords(s => {
      s.placeholder = 'keep'
      let newS = newSeminars.find(_s => _s.scheduleId === s.scheduleId)
      s.presenter = newS.presenter
      s.owner = newS.owner
      s.date = newS.date
    })(seminars)
    return updateRecords(seminars)
  }

  Seminar.swap = async (seminar1Id, seminar2Id) => {
    const {Event} = require('../models')
    let now = new Date()
    let [s1, s2] = [await Seminar.findById(seminar1Id), await Seminar.findById(seminar2Id)]
    let either = f => f(s1) || f(s2)
    if (either(s => s.date < now)) {
      throw new Error('Cannot swap seminar in the past')
    }
    if (either(s => s.scheduleId == null)) {
      throw new Error('Cannot swap non-auto generated seminar')
    }
    if (either(s => !s.placeholder)) {
      throw new Error('Cannot swap modified seminar')
    }
    await new Event({
      name: require('../utils').const.event.seminar.swap,
      date: now,
      meta: JSON.stringify([s1.scheduleId, s2.scheduleId])
    }).save()
    let swapProp = prop => { [s1[prop], s2[prop]] = [s2[prop], s1[prop]] }
    swapProp('presenter')
    swapProp('owner')
    s1.placeholder = s2.placeholder = 'keep'
    return updateRecords([s1, s2])
  }

  Seminar.applySwap = seminars => {
  }

  Seminar.addFutureSeminars = async fromDate => {
    let [futureSeminars, seminars] = [
      await Seminar.futureSeminars(fromDate),
      await Seminar.after(fromDate, true)]
    let newSeminars = []
    futureSeminars.sort((a, b) => b.scheduleId - a.scheduleId)
    for (let s of futureSeminars) {
      if (!seminars.find(_s => _s.scheduleId === s.scheduleId)) {
        newSeminars.push(s)
      } else {
        break
      }
    }
    return updateRecords(newSeminars)
  }

  Seminar.after = (date, placeholder) =>
    Seminar.findAll(
      placeholder
      ? {
        where: {
          date: { $gte: date },
          placeholder: { $eq: true },
          scheduleId: { $gte: 0 }
        }
      }
      : {
        where: {
          date: { $gte: date }
        }
      }
    )

  Seminar.setWeekday = async (date, weekday) => {
    let {System} = require('../models')
    let seminars = await Seminar.after(date, true)
    await System.change(c => { c.seminarWeekday = weekday })
    return promise(seminars)
      .then(modifyRecords(s => {
        s.date = daysAfter(toWeek(s.date), Number(weekday))
        s.placeholder = 'keep'
      }))
      .then(updateRecords)
  }

  return Seminar
}
