"use strict";

module.exports = function(sequelize, DataTypes) {
  var Seminar = sequelize.define("Seminar", {
    presenter: DataTypes.STRING,
    date: DataTypes.DATE,
    topic: DataTypes.STRING,
    slides: DataTypes.STRING,
    owner: DataTypes.STRING
  });

  Seminar.associate = function(models) {
    Seminar.hasMany(models.Slide);
  }
    
  return Seminar;
};
