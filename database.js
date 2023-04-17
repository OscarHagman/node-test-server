// database.js
// import { Sequelize } from 'sequelize';
import mysql from "mysql"
import dotenv from 'dotenv';

dotenv.config();

console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE)
console.log('MYSQLUSER:', process.env.MYSQLUSER)
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD)
console.log('MYSQLHOST:', process.env.MYSQLHOST)

const con = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
})

con.connect((err) => {
  if (err) throw err
  console.log("connected to MySQL database")

  const sql = "CREATE TABLE todos (name VARCHAR(255), done BOOLEAN)";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Todos table created");
  })
})

export const createTodo = (name, done) => {
  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    var sql = `INSERT INTO todos (name, done) VALUES ('${name}', '${done}')`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
      return result
    });
  });
}

export const getTodos = () => {
  con.connect((err) => {
    if (err) throw err;
    con.query("SELECT * FROM todos", (err, result, fields) => {
      if (err) throw err;
      console.log(fields)
      return result
    });
  });
}

// const sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
//   host: process.env.MYSQLHOST,
//   dialect: 'mysql',
//   // logging: false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   dialectOptions: {
//     connectTimeout: 60000, // Increase the connection timeout value (in milliseconds)
//   },
// });

// export default sequelize;
