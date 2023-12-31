const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ue4cbab.mongodb.net/?retryWrites=true&w=majority`;

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

    const productsCollection = client.db("gadgetCornerDB") .collection('products');

    // Products collection Server

    app.get("/totalProducts" , async(req , res)=>{
        const result = await productsCollection.estimatedDocumentCount();
        res.send({totalProducts: result});
    })
    
    app.get("/offeredProducts" , async(req ,res)=>{
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const skip = page*limit;
      const result = await productsCollection.find().skip(skip).limit(limit).toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/" , (req,res)=>{
    res.send("Welcome To Gadget Corner!");
})

app.listen(port, ()=>{
    console.log("server Is Running");
})

// gadgetCornerDB
// Cuznjjk1A0iRFJyC
