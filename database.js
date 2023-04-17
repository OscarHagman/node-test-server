// database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE)
console.log('MYSQLUSER:', process.env.MYSQLUSER)
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD)
console.log('MYSQLHOST:', process.env.MYSQLHOST)

const sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  dialect: 'mysql',
  logging: false,
});

export default sequelize;
