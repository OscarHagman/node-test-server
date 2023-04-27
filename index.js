import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import AWS from 'aws-sdk'
import { config as dotenvConfig } from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenvConfig()
const dynamoDB = new AWS.DynamoDB.DocumentClient()

const buildUpdateExpression = (attributes) => {
  const keys = Object.keys(attributes);
  const updateExpression = 'set ' + keys.map(key => `#a_${key} = :v_${key}`).join(', ');
  const expressionAttributeNames = keys.reduce((acc, key) => {
    acc[`#a_${key}`] = key;
    return acc;
  }, {});
  const expressionAttributeValues = keys.reduce((acc, key) => {
    acc[`:v_${key}`] = attributes[key];
    return acc;
  }, {});

  return {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };
}

// DELETE
// const params = {
//   TableName: 'todo',
//   Key: {
//     id: '1'
//   }
// };

// dynamoDB.delete(params, (err, data) => {
//   if (err) {
//     console.error('Error deleting item:', JSON.stringify(err, null, 2));
//   } else {
//     console.log('Item deleted:', JSON.stringify(data, null, 2));
//   }
// });


// UPDATE
// const attributesToUpdate = {
//   task: 'GET SHIT DONE!',
// };

// const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = buildUpdateExpression(attributesToUpdate);

// const updateItemParams = {
//   TableName: 'todo',
//   Key: {
//     id: '2',
//   },
//   UpdateExpression,
//   ExpressionAttributeNames,
//   ExpressionAttributeValues,
//   ReturnValues: 'UPDATED_NEW',
// };

// "OLD WAY"
// const updateItemParams = {
//   TableName: 'todo',
//   Key: {
//     id: '1',
//   },
//   UpdateExpression: 'set completed = :c',
//   ExpressionAttributeValues: {
//     ':c': false,
//   },
//   ReturnValues: 'UPDATED_NEW',
// };

// dynamoDB.update(updateItemParams, (err, data) => {
//   if (err) {
//     console.error('Error updating item:', JSON.stringify(err, null, 2));
//   } else {
//     console.log('Item updated:', JSON.stringify(data, null, 2));
//   }
// });

// READ
// const getItemParams = {
//   TableName: 'todo',
//   Key: {
//     id: '1',
//   },
// };

// dynamoDB.get(getItemParams, (err, data) => {
//   if (err) {
//     console.error('Error fetching item:', JSON.stringify(err, null, 2));
//   } else {
//     console.log('Item fetched:', JSON.stringify(data, null, 2));
//   }
// });

// CREATE
// const item = {
//   id: '2',
//   task: 'Get shit done',
//   completed: false
// }

// const params = {
//   TableName: 'todo',
//   Item: item
// };

// dynamoDB.put(params, (err, data) => {
//   if (err) {
//     console.error('Error adding item:', JSON.stringify(err, null, 2));
//   } else {
//     console.log('Item added:', JSON.stringify(data, null, 2));
//   }
// })



// APP
const app = express()
const port = process.env.PORT || 3000

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const corsOptions = {
   origin:'*', 
   credentials:true, //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

// TEST
app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

app.get('/ping', (req, res) => {
  res.status(200).send({ msg: 'pong'})
})

app.post('/post', (req, res) => {
  res.status(200).send({ res: req.body })
})


// APPLICATION
app.post('/todo/create', async (req, res) => {
  const uniqueId = uuidv4()
  console.log("id:", uniqueId)
  const item = {
    ...req.body,
    id: uniqueId,
  }

  const params = {
    TableName: 'todo',
    Item: item
  };

  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error('Error adding item:', err)
      console.log('Data:', data);
      res.status(500).send({
        msg: `Error adding item`,
        error: `${err}`
      })
    } else {
      res.status(200).send({
        msg: "successfully added item",
      })
    }
  })
})


app.get('/todo/read/:id', async (req, res) => {
  const { id } = req.params
  
  const getItemParams = {
    TableName: 'todo',
    Key: {
      id,
    },
  };
    
  try {
    const data = await dynamoDB.get(getItemParams).promise()
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error getting todo:', JSON.stringify(error, null, 2))
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.put('/todo/update/:id', (req, res) => {
  const { id } = req.params

  const attributesToUpdate = {
    ...req.body
  }

  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  } = buildUpdateExpression(attributesToUpdate)

  const updateItemParams = {
    TableName: 'todo',
    Key: {
      id,
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  }

  dynamoDB.update(updateItemParams, (err, data) => {
    if (err) {
      console.error('Error updating item:', JSON.stringify(err, null, 2))
      res.status(500).send({
        msg: "Error updating item",
        error: err
      })
    } else {
      console.log('Item updated:', JSON.stringify(data, null, 2))
      res.status(200).send({
        msg: "Successfully updated todo"
      })
    }
  });
})


app.delete('/todo/delete/:id', (req, res) => {
  const { id } = req.params

  const params = {
    TableName: 'todo',
    Key: {
      id
    }
  }

  dynamoDB.delete(params, (err, data) => {
    if (err) {
      console.error('Error deleting item:', err)
      res.status(500).send({
        msg: "Error deleting item",
        error: err
      })
    } else {
      res.status(200).send({
        msg: `Successfully deleted item ${id}`
      })
    }
  })
})



app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
