"use strict";

module.exports = function(sequelize, DataTypes) {
    var ContactList = sequelize.define("ContactList", {
          seat: DataTypes.INTEGER,
          name: DataTypes.STRING,
          account: DataTypes.STRING,
          email: DataTypes.STRING,
          phone: DataTypes.STRING,
          avatar: DataTypes.STRING

    });
    
    return ContactList;
};
