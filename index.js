const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rchgrre.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const topFoodCollection = client.db('restaurantDB').collection('topFood');
    const allFoodCollection = client.db('restaurantDB').collection('allFood');

    app.get('/topFoods', async(req, res) =>{
        const result = await topFoodCollection.find().toArray();
        res.send(result);
    })
    app.get('/allFoods', async(req, res) =>{
        const result = await allFoodCollection.find().toArray();
        res.send(result);
    })
    app.get('/food', async(req,res) =>{
      const name = (req.query.name);
      const query = {food_name:name};
      result = await allFoodCollection.findOne(query);
      res.send(result);
    })

    app.get('/singleFood/:id', async (req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await allFoodCollection.findOne(query);
      res.send(result);
    })
    app.get('/singleTopFood/:id', async (req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await topFoodCollection.findOne(query);
      res.send(result);
    })

    app.get('/foodsCount', async(req, res) =>{
      const count = await allFoodCollection.estimatedDocumentCount();
      res.send({count});
    })

    
    app.get('/allFoods', async(req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
        const result = await allFoodCollection.find()
        .skip(page * size)
        .limit(size)
        .toArray();
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
  res.send('Server running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})