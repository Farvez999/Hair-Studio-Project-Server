const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mordayw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const serviceCollection = client.db('cuteCut').collection('services');
        const reviewsCollection = client.db('cuteCut').collection('reviews');


        //all data read
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        //single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })


        //service homepage
        app.get('/serviceshome', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).sort({ $natural: -1 })
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })

        //Create a single service
        app.post('/services', async (req, res) => {
            const addService = req.body;
            const result = await serviceCollection.insertOne(addService)
            res.send(result);
        })

        //Create a single reviews
        app.post('/reviews', async (req, res) => {
            const addReviews = req.body;
            const result = await reviewsCollection.insertOne(addReviews)
            res.send(result);
        })

        //all data reviews
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        app.get('/reviews/:id', async (req, res) => {
            const query = req.params.id
            console.log(query)
            const cursor = reviewsCollection.find({ service: query }).sort({ _id: -1 })
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Cute Cut Hair Studio is Running')
})

app.listen(port, () => {
    console.log(`Cute Cut Hair Studio running on Server ${port}`);
})