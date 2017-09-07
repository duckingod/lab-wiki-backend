"use strict";

module.exports = function(sequelize, DataTypes) {
  var Seminar = sequelize.define("Seminar", {
    presenter: {
		type: DataTypes.STRING,
		validate: {
			// notEmpty: true
		}
	},
    date: {
		type: DataTypes.DATE,
		validate: {
			notEmpty: true,
			isDate: true
		}
	},
    topic: {
		type: DataTypes.STRING,
		validate: {
			// notEmpty: true
		}
	},
    slides: {
		type: DataTypes.STRING,
		validate: {
			// notEmpty: true
		}
	},
    owner: {
		type: DataTypes.STRING,
		validate: {
			notEmpty: true
		}
	}
  });

  Seminar.associate = function(models) {
    Seminar.hasMany(models.Slide);
  }
    
  return Seminar;
};
