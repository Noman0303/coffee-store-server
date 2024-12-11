const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fguqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

        //Connect to the "coffeeDB" database and access its "coffeeCollection" collection. EkhaneMongoDB te user er under e collection er nam coffee nam e create hobe. 
        const coffeeCollection = client.db('coffeeDB').collection('coffee');

        // Server theke data read korte app.get use korbo. ekhane cursor holo ekta pointer select kora hocche data read korar jonno in coffeeCollection. Then sei cursor ke read korar jonno json theke array te convert korbo.then sei result ke response hisebe pathay dibo.

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // document already created as newCoffee here by app.post function for the server/coffee route

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            // Insert the defined document into the "coffeeCollection" 
            const result = await coffeeCollection.insertOne(newCoffee)
            // sending the result as a response to the server/coffee route
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            /* Delete the first document in the "coffee" collection that matches
        the specified query document */
            const query = {_id:new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query);
            // sending the result as a response to the server/coffee route
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


// To check & run the server 
app.get('/', async (req, res) => {
    res.send('coffee making server is running')
})

//  To listen from server 

app.listen(port, () => {
    console.log(`Coffee server is running on port: ${port}`)
})

