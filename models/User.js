// Define the Models
// The User Model attributes

'use strict';

const{Model, DataTypes} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init(
        firstName, {
                type:DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull:{
                        msg:'A first name is required'
                },
                notEmpty:{
                    msg:'Please provide a first name'
                }
            }
    },
        lastName, {
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull: {
                    msg:'A last name is required'
                },
                notEmpty:{
                    msg:'Please provide a last name'
                }
            }    

        },
        emailAddress,{
            type:DataTypes.STRING,
            allowNull: false,
            unique: {
                msg:'This email already exists'
            },
            validate: {
                notNull:{
                    msg:'An email address is required'
                },
                isEmail: {
                    msg:'Please provide a valid email address'
                }
            }
        },
        password, {
            type:DataTypes.STRING,
            allowNull: false,
            set(val){
                if(val === this.password){
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('Password', hashedPassword);
                }
            }

        },
        validate: {
            notNull:{
                msg:'A password is required'
            },
            notEmpty: {
                msg:'Please provide a passowrd'
            }
        }, {sequelize}

        User.associate =(models) => {
            User.hasMany(models.Course, {
                as:'User',
                foreignKey: {
                    fieldName:'userid',
                    allowNull:false,
                }
            }

            )
        }
 )}

