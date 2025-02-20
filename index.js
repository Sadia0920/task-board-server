require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to task board Server')
  })
  
  app.listen(port, () => {
    console.log(`task board Server Running on port ${port}`)
  })