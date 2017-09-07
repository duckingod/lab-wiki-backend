"use strict";

module.exports = function (sequelize, DataTypes) {
  var News = sequelize.define("News", {
    title: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    content: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    date: {
        type: DataTypes.DATE,
        validate: {
            notEmpty: true,
            isDate: true
        }
    }
  });

  return News;
};
