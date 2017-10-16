'use strict'

const config = require('../config')
const utils = require('../utils')
const {modifyRecords, modifyRecordsAsync, updateRecords} = utils.model
const {_with} = utils.models
const {listify, promise} = utils
const {daysAfter, toWeek, weeksBetween, weekdayOf} = utils.date

// -(negative generateId) === (id of contact)
// negative generateId only appears at beginning of swap events

const swapList = async () => {
  let {Event} = require('../models')
  let {swap} = utils.const.event.seminar
  let events = await Event.get(swap)
  events.sort((a, b) => a.date - b.date)
  let map = {}
  let get = k => k >= 0 ? (map[k] || k) : k
  for (let e of events) {
    let [f, t] = e.meta
    let [trueF, trueT] = [get(f), get(t)]
    map[f] = trueT
    map[t] = trueF
  }
  return map
}

const swapPresenterComp = async beforeDate => {
  beforeDate = toWeek(beforeDate || new Date())
  const {ContactList} = require('../models')
  const idMap = await swapList()
  const swaps = {}
  const {weeks, perWeek} = config.seminarSchedule
  let schedule = await ContactList.dutyWithDate('seminar', {
    toDate: beforeDate,
    nPerWeek: perWeek
  })
  let futureSchedule = await ContactList.dutyWithDate('seminar', {
    fromDate: beforeDate,
    nRound: weeks,
    nPerWeek: perWeek
  })
  let contacts = await ContactList.all()
  let lastPresentation = schedule[schedule.length - 1]
  let futureLastPresentation = futureSchedule[futureSchedule.length - 1]
  let addSwap = (originalContact, replacedBy) => {
    swaps[originalContact.account] || (swaps[originalContact.account] = [])
    swaps[originalContact.account].push(replacedBy)
  }
  for (let originalPresentation of schedule) {
    let swappingId = idMap[originalPresentation.id]
    if (swappingId != null &&
      swappingId >= 0 &&
      swappingId > lastPresentation.id &&
      swappingId <= futureLastPresentation.id
    ) {
      let swappingContact = futureSchedule.find(_s => _s.id === swappingId).contact
      addSwap(swappingContact, originalPresentation.contact)
    }
  }
  for (let futurePresentation of futureSchedule) {
    let swappingId = idMap[futurePresentation.id]
    if (swappingId != null && swappingId < 0) {
      let replacingContact = contacts.find(c => c.id === -swappingId)
      addSwap(futurePresentation.contact, replacingContact)
    }
  }
  return swaps
}

const duty2Seminar = async duties => {
  const {System, Seminar} = require('../models')
  let weekday = (await System.load()).seminarWeekday
  return listify(duties, presentation =>
    new Seminar().with({
      contact: presentation.contact,
      date: daysAfter(presentation.date, weekday),
      scheduleId: presentation.id,
      topic: '.'
    })
  )
}

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

  Object.defineProperty(Seminar.prototype, 'contact', {
    // TODO need to retrive with unique field ..., this will crash if there exists two contact with the same name
    get: async function () {
      const {ContactList} = require('../models')
      return ContactList.findOne({ where: { name: this.getDataValue('presenter') } })
    },
    set: function (contact) {
      this.setDataValue('presenter', contact.name)
      this.setDataValue('owner', contact.accountEmail)
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

  Seminar.prototype.with = _with

  Seminar.beforeUpdate(function (seminar, options) {
    seminar.placeholder = seminar.placeholder === 'keep' ? undefined : false
  })

  // Seminar.futureSeminars = () =>
  //   Seminar.findAll({ where: { date: { $gte: new Date() } } })

  Seminar.futureSeminars = async ({fromDate, weeks, all, asSchedule}) => {
    const {ContactList} = require('../models')
    weeks = weeks || config.seminarSchedule.weeks
    let duties = await ContactList.dutyWithDate(
      'seminar',
      {
        nRound: weeks,
        nPerWeek: 2,
        fromDate: fromDate,
        all: all
      }
    )
    return asSchedule ? duties : duty2Seminar(duties)
  }

  Seminar.postpone = async id => {
    const {dutyProp} = utils.schedule
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
    let [seminars, newSeminars] = [await Seminar.findAll(args), await Seminar.futureSeminars({fromDate: seminar.date})]
    return modifyRecordsAsync(async s => {
      s.placeholder = 'keep'
      let newS = newSeminars.find(_s => _s.scheduleId === s.scheduleId)
      s.contact = await newS.contact
      s.date = newS.date
    })(seminars)
      .then(updateRecords)
  }

  Seminar._1 = swapList
  Seminar._2 = swapPresenterComp
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
    await new Event()
      .with({
        name: utils.const.event.seminar.swap,
        date: now,
        meta: [s1.scheduleId, s2.scheduleId]
      })
      .save()
    let [tmpC1, tmpC2] = [await s2.contact, await s2.contact]
    s1.contact = tmpC1
    s2.contact = tmpC2
    s1.placeholder = s2.placeholder = 'keep'
    return updateRecords([s1, s2])
  }

  Seminar.applySwap = async seminars => {
    let {ContactList, Event} = require('../models')
    let contacts = await ContactList.all()
    let {swap} = utils.const.event.seminar
    let events = await Event.get(swap)
    events.sort((a, b) => a.date - b.date)
    seminars = await Promise.all(listify(seminars, async s => s.copy()))
    for (let e of events) {
      let swapIds = e.meta
      let [p1, p2] = listify(swapIds, id =>
        id >= 0
          ? seminars.find(s => s.scheduleId === id)
          : {contact: contacts.find(c => c.id === -id)})
      let [c1, c2] = [await p2.contact, await p1.contact]
      p1.contact = c1
      p2.contact = c2
    }
    return seminars
  }

  Seminar.reschedule = async (newIdList, initialDate) => {
    const {swap, skip} = utils.const.event.seminar
    const {ContactList, Event, System} = require('../models')
    const genesis = new Date(config.genesis)
    const contacts = await ContactList.all()
    const weekday = weekdayOf(initialDate)
    initialDate = toWeek(initialDate)
    const getSwapMap = async () => {
      let original = await Seminar.futureSeminars({
        fromDate: initialDate,
        all: true
      })
      let swapped = await Seminar.applySwap(original)
      let swapMap = {}
      for (let contact of contacts) {
        swapMap[contact.accountEmail] = []
      }
      for (let i in original) {
        if (original[i].date >= initialDate && original[i].owner !== swapped[i].owner) {
          let swappingContact = contacts.find(c => c.accountEmail)
          swapMap[original[i].owner].push(swappingContact)
        }
      }
      return swapMap
    }
    const clearEvents = async () => {
      let duties = await ContactList.dutyWithDate(
        'seminar',
        {
          fromDate: initialDate,
          toDate: daysAfter(initialDate, 4 * 7) }) // magic number XD
      let firstPresentationId = duties[0].scheduleId
      let pastSkips = (await Event.get(skip)).filter(s => s.meta < firstPresentationId)
      await Event.destroy({ where: { name: swap } })
      // Destory all pastpone events before the date: they don't affect result
      // And can simplify the following procedure
      await Event.destroy({ where: { id: { $in: listify(pastSkips, s => s.id) } } })
    }
    const removeOriginalSeminars = async () => {
      await Seminar.destroy({
        where: {
          date: { $gte: initialDate },
          placeholder: true
        }
      })
    }
    const setContactSeminarId = async () => {
      let {perWeek} = config.seminarSchedule
      let idxThisWeek = weeksBetween(genesis, initialDate) * perWeek % newIdList.length
      let initialIdx = newIdList.length - idxThisWeek
      await promise(await ContactList.all())
        .then(modifyRecords(contact => {
          let idx = newIdList.indexOf(contact.id)
          contact.seminarId = idx >= 0
            ? (idx + initialIdx) % newIdList.length + 1
            : 0
        }))
        .then(updateRecords)
    }
    const preSwapEvents = (schedule, swapMap) => {
      // When reschedule again, we need to swap presenter by the same ways.
      // Hence the swapping ways are saved into events.
      let events = []
      let now = new Date()
      for (let presentation of schedule) {
        let swapCandidates = swapMap[presentation.contact.accountEmail]
        if (swapCandidates.length > 0) {
          let swappingContact = swapCandidates.shift()
          events.push(new Event().with({
            name: utils.const.event.seminar.swap,
            date: now,
            meta: [-swappingContact.id, presentation.id]
          }))
        }
      }
      return events
    }

    let swapMap = await getSwapMap()
    await clearEvents()
    await setContactSeminarId()
    await removeOriginalSeminars()
    let schedule = await Seminar.futureSeminars({ fromDate: initialDate, asSchedule: true })
    await promise(preSwapEvents(schedule, swapMap))
      .then(updateRecords)
    await System.change(c => { c.seminarWeekday = weekday })
    schedule = await Seminar.futureSeminars({ fromDate: initialDate })
    schedule = await Seminar.applySwap(schedule)
    await promise(schedule)
      .then(updateRecords)
    return Seminar.all()
  }

  Seminar.addFutureSeminars = async fromDate => {
    let [futureSeminars, seminars] = [
      await Seminar.futureSeminars({fromDate: fromDate}),
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
