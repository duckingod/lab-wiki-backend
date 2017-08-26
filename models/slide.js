"use strict";

module.exports = function(sequelize, DataTypes) {
    var Slide = sequelize.define("Slide", {
          owner: DataTypes.STRING,
          title: DataTypes.STRING,
          date: DataTypes.DATE,
          file: DataTypes.STRING
        });

    Slide.associate = function(models) {
        Slide.belongsTo(models.Seminar, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
              }
            });
        };

    return Slide;
};
