// Define the Models
// The Course Model attributes

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // define association here
    }
  }
  Course.init(
    {
      // Title STRING
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title is required",
          },
          notEmpty: {
            msg: "Please provide a title",
          },
        },
      },
      // Description TEXT
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description is required",
          },
          notEmpty: {
            msg: "Please provide a description",
          },
        },
      },
      //estimatedTime STRING
      estimatedTime: DataTypes.STRING,
      //materialsNeeded STRING
      materialsNeeded: DataTypes.STRING,
    },
    { sequelize, modelName: "Course" }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: "User",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Course;
};
