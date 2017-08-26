"use strict";

module.exports = function(sequelize, DataTypes) {
    var News = sequelize.define("News", {
          title: DataTypes.STRING,
          content: DataTypes.BLOB,
          date: DataTypes.DATE
        });
    
    return News;
};
