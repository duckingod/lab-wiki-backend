'use strict'

module.exports = function (sequelize, DataTypes) {
  var Slide = sequelize.define('Slide', {
    owner: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    file: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  })

  /*
  Slide.associate = function (models) {
    Slide.belongsTo(models.Seminar, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    })
  }
   */
  return Slide
}
