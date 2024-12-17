// Express application set up. 
// import express
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// importing mongoClient from mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// creating an app on express
const app = express();
// creating a port
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// mongodb atlas e sign in korbo > then connet to cluster > drivers > select Node.js as driver > install mongoDb if not yet > add my mongodb connection string to my application code. 
// uri variable er under e connection string paste korbo & user & pass update korbo.

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fguqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
        // Connect the client to the server	

        await client.connect();

        //Connect to the "coffeeDB" database in MongoDB and access its data.
        //  Ekhane MongoDB te client name 'coffeeDB un'der e coffeeCollection/coffee gulor data 'coffee' nam e folder create hobe & pore ekhanei save hobe. 
        //  & Same MongoDB te client name 'coffeeDB un'der e userCollection/user der data 'user' nam e folder e create hobe & pore ekhanei save hobe. 

        const coffeeCollection = client.db('coffeeDB').collection('coffee');
        const userCollection = client.db('coffeeDB').collection('user');


        // coffee app e add korbo. add korar jonno post korbo.Ekhane user data req.body theke pacchi. 
        // Ekhane ei je req.body theke amra data nite chacchi... eitate acceess korar jonnoi app.use(expressjson()) middleware use korte hobe. ta na hole client side theke send kora data gulo konotai json e convert hoto na & amra undefined petam. 
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
        });


        // Server theke data read korte app.get use korbo. ekhane cursor holo ekta pointer select kora hocche data read korar jonno in coffeeCollection. Then sei cursor ke read korar jonno json theke array te convert korbo.then sei result ke response hisebe pathay dibo.

        // Data read
        // Coffee Data Read. Here the main function is 
        //  app.get('/coffee', async (req, res) => {
        // res.send([]);
        // }) 
        // Actually ei route e amra sob coffee data read korte chacchi. coffeeCollection variable nam die coffee gular data agei MongoBD er ei folder e amra json format e save korechi. So user collection theke amra find die sob data find korbo & user variable er under e array te convert korbo. pore ei user variable to response hosebe server 5000 port e send kore dibo. 

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Users Data Read

        //  Here the main function is 
        //  app.get('/user', async (req, res) => {
        // res.send([]);
        // }) 
        // Actually ei route e amra sob user data read korte chacchi. userCollection variable nam die user der data agei MongoBD er ei folder e amra json format e save korechi. So user collection theke amra find die sob data find korbo & user variable er under e array te convert korbo. pore ei user variable to response hosebe server 5000 port e send kore dibo. 

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const user = await cursor.toArray();
            res.send(user);
        })


        // ID wise Data get & update

        // Individual Coffee Data Read 

        //  Here the main function is 
        //  app.get('/coffee/:id', async (req, res) => {
        // res.send([]);
        // }) 
        // Actually ei route e amra individual user data read korte chacchi. coffeeCollection variable nam die coffee  data agei MongoBD er ei folder e amra json format e save korechi. So coffee collection theke amra findOne die particular data find korbo. Ekhane ektai data dekhe ar array te convert korini.

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        // Data update 

        // Coffee Data Update . app er upor put finction apply kore protita coffee er against e nicher format e data save korechi.

        
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
        });

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
        });


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
        });

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
        });



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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


//  To listen from server on the declared port
app.listen(port, () => {
    console.log(`Coffee server is running on port: ${port}`)
})

