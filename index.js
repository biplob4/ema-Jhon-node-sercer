const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ema-jhon.v30yl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('emaJhon').collection('product');

        // pagenation ?page=${page}&size=${size}
        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            let products;
            const query = {};
            const cursor = productsCollection.find(query);
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            } else {
                products = await cursor.toArray();
            }
            res.send(products)
        });

        // all product count to dataBase
        app.get('/productCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count });
        });

        // use id keys to get order all products
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => (ObjectId(id)));
            const query = {_id: {$in: ids}};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })  

    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Jone is Running and wait fot ema')
})

app.listen(port, () => {
    console.log('Jhon in running on port', port);
})