const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER }:${process.env.DB_PASS}@cluster0.fguqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// To check & run the server 
 app.get('/',async(req,res) =>{
    res.send('coffee making server is running')
 })

//  To listen from server 

app.listen(port, () =>{
    console.log(`Coffee server is running on port: ${port}`)
})
