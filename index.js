const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

//middlewar
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ld5wy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("tourService");
      const servicesCollecton = database.collection("services");
      const bookingCollection = database.collection("booking")
        

      //get api
      app.get('/services', async(req, res)=>{
          const cursor = servicesCollecton.find({});
          const services = await cursor.toArray();
          res.send(services);
      });

    
        //POST API
        app.post('/services', async(req, res) =>{
            const service = req.body;
            console.log('hit the post api', service)
              const result = await servicesCollecton.insertOne(service);
            res.json(result)
        });

        //POST API
    app.post('/booking', async(req, res) =>{
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        res.json(result)
    });

    app.get('/booking',async(req,res)=>{
        const cursor = bookingCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
    })
    
    app.delete('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await bookingCollection.deleteOne(query);
        res.json(service);
    })
    
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/',(req,res)=> {
    res.send('This is home')
})

app.listen(port, () =>{
    console.log('Running genius server', port);
})
