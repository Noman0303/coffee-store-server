const express = require('express')
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000

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
        const userCollection = client.db('coffeeDB').collection('user');


        // document creates as newCoffee here by app.post function for the server/coffee route
        // Data Create
        // Data create for coffee

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            // Insert the defined document into the "coffeeCollection" 
            const result = await coffeeCollection.insertOne(newCoffee)
            // sending the result as a response to the server/coffee route
            res.send(result)
        })

        // Data create for user

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            // insert the defined document into the "userCollection"
            const result = await userCollection.insertOne(user)
            // sending the result as a response to the server/user route   
            res.send(result)
        })


        // Server theke data read korte app.get use korbo. ekhane cursor holo ekta pointer select kora hocche data read korar jonno in coffeeCollection. Then sei cursor ke read korar jonno json theke array te convert korbo.then sei result ke response hisebe pathay dibo.

        // Data read
        // Coffee Data Read

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Users Data Read

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const user = await cursor.toArray();
            res.send(user);
        })


        // ID wise Data get & update

        // Data get for update 

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        // Data update 

        // Coffee Data Update 
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    quantity: updatedCoffee.quantity,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo,
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        // Update  user data 

        app.patch('/user', async (req, res) => {
            // user route er body theke sob data request korechi
            const user = req.body;
            // normally different users er email identical/ diffenent hoy. Tai amra email ke dhore filter korbo. 
            const filter = { email: user.email }
            // update a document that sets the plot of the particular item of the user . 
            const updateDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt
                }
            }
            // userCollection er majhe particularly ekta item ke update korbo
            // ekhane const options = { upsert: true }; eita optional. This option instructs the method to create a document if no documents match the filter. So eita ekhane use korini. 
            // also const result e updateDoc er por ar kichu rakha hoynai. 
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        // Data Delete

        // Coffee Delete
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            /* Delete the first document in the "coffee" collection that matches
        the specified query document */
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            // sending the result as a response to the server/coffee route
            res.send(result);
        })

        // User Delete
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            /* Delete the first document in the "coffee" collection that matches
        the specified query document . MongoDB doesnt understand id. So it is defined with query*/
            const query = { _id: new ObjectId(id) };
            // delete operation. identify korte hobe kake delete korbo. ekhane result holo await/opekkha korbo, userCollection er majhe deleteOne die query ke delete korbo. query agei select korse kon id delete korte hobe. 
            const result = await userCollection.deleteOne(query);
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

