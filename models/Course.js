// Define the Models
// The Course Model attributes

'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model{}
    Course.init({
        id:{
            type:DataTypes.STRING,
            primaryKey: true,
            autoincrement: true
        },
        // Title STRING
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg:'Please provide a title'
                }
            }

        },
        // Description TEXT
        description:{
            type:DataTypes.TEXT,
            allowNull: false,
            validate:{
                notNull:{
                    msg:'Description is required'
                },
                notEmpty:{
                    msg:'Please provide a description'
                }
            }
        },
        //estimatedTime STRING
        estimatedTime:{
            type:DataTypes.STRING
        },
        //materialsNeeded STRING
        materialsNeeded:{
            type:DataTypes.STRING
        },
       
        {sequelize}

        Course.associate = (models) => {
            Course.belongsTo(models.user, {
                foreignKey:{
                    fieldName: 'userid',
                    allowNull: false,
                }

            })
        }
    })
    return Course;
}