import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'

import sequelize, { createTodo, getTodos } from './database.js';
import Sample from './model.js';

const app = express()
const port = process.env.PORT || 3000

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const corsOptions = {
   origin:'*', 
   credentials:true, //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))


app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

app.get('/ping', (req, res) => {
  res.status(200).send({ msg: 'pong'})
})

app.post('/post', (req, res) => {
  res.status(200).send({ res: req.body })
})

// MySQL
app.get('/db/get-all-todos', async (req, res) => {
  res.status(200).send(getTodos())
  // const samples = await Sample.findAll();
  // res.status(200).json(samples);
})

app.post('/db/create-todo', async (req, res) => {
  const { name } = req.body
  
  const results = createTodo(name, false)
  if (results) res.status(200).send(results)
  else res.status(500).send(results)
  // try {
  //   const { name, description, done } = req.body;
  //   const newSample = await Sample.create({ name, description, done });
  //   res.status(201).json(newSample);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: 'Error inserting data into the table' });
  // }
})

app.put('/db/update-todo', async (req, res) => {

})

app.delete('/db/delete-todo', async (req, res) => {

})

sequelize
  .sync({ force: true }) // Use { force: true } only for development. It drops and recreates tables on every start.
  .then(() => {
    console.log('Database synced');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Test server running on port ${port}`)
    })
  })
  .catch((error) => console.log('Error syncing database:', error));



