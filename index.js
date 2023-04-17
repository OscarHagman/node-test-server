import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs'

const app = express()
const port = 3001

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json({ limit: '100mb' }));

const corsOptions = {
   origin:'*', 
   credentials:true, //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))


app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Hello World!' })
})

app.post('/write-to-file', (req, res) => {
  const jsonData = JSON.stringify(req.body)

  fs.writeFile('output.json', jsonData, 'utf8', function (err) {
    if (err) {
      console.log('an error occured:\n')
      return console.log(err)
    }
  })
  console.log("Wrote to file:", jsonData)
  res.status(200).send({msg: "ok"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

