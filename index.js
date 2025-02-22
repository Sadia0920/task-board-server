require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g9mg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("taskBoardDB");
    const usersCollection = database.collection("users");
    const tasksCollection = database.collection("tasks");

    // users
    app.get('/users',async(req,res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result);
    })

    app.post('/users',async(req,res)=>{
      const user = req.body;
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'user already exists',insertedId: null})
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    // tasks
    // app.get('/tasks',async(req,res)=>{
    //   const result = await tasksCollection.find().toArray()
    //   res.send(result);
    // })

    app.get('/tasks/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await tasksCollection.findOne(query);
      res.send(result);
    })

    app.get('/tasks',async(req,res)=>{
      const email = req.query.email;
      const query = {email: email};
      const result = await tasksCollection.find(query).toArray()
      res.send(result);
    })

    app.post('/tasks',async(req,res)=>{
      const note = req.body;
      const result = await tasksCollection.insertOne(note)
      res.send(result)
    })

    app.patch('/tasks/inProgress/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          category:'In Progress'
        }
      }
      const result = await tasksCollection.updateOne(filter,updatedDoc)
      res.send(result);
    })

    app.patch('/tasks/done/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          category:'Done'
        }
      }
      const result = await tasksCollection.updateOne(filter,updatedDoc)
      res.send(result);
    })


    app.put('/tasks/:id',async(req,res)=>{
      const id = req.params.id;
      const newTask = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true}
      const updateTask = {
        $set: {
          title: newTask.title,
          category: newTask.category,
          description: newTask.description,
          timestamp: newTask.timestamp,
        }
      }
      const result = await tasksCollection.updateOne(filter,updateTask,options)
      res.send(result)
    })


    app.delete('/tasks/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to task board Server')
  })
  
  app.listen(port, () => {
    console.log(`task board Server Running on port ${port}`)
  })