import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs'

const app = express()
const port = 3000

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

