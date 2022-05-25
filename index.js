//import require packages
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

//Express App and Port Ready for use
const app = express();
const port = process.env.PORT || 5000;

//Middle ware
app.use(cors());
//for post response getting
app.use(express.json());

//!DATABASE CONNECTION URL SETUP = uri change user, pass env,
const uri = 'mongodb+srv://electro_pro_user:BZoNZxZ2qDUCJZQE@cluster0.44qqp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//ASYNC FUNCTION FOR DATABASE CRUD Operation
async function run() {
   // DATABASE CONNECTED
   await client.connect();
   console.log('database connected');

   //!DATABASE TABLE CREATING : (PRODUCTS,ORDERS,USERS,)
   const productsCollection = client.db('electro-pro').collection('products');
   // console.log('created table');

   //link : http://localhost:5000/products
   //!GET REQUEST DONE
   app.get('/products', async (req, res) => {
      const query = req.query;
      const result = await productsCollection.find(query).toArray();
      res.send(result);
   });

   //link : http://localhost:5000/products
   //!POST REQUEST CODE
   app.post('/products', async (req, res) => {
      //DATA collecting form input form
      const productData = req.body;
      const result = await productsCollection.insertOne(productData);
      res.send({ result: 'success' });
   });

   //link : http://localhost:5000/delete-products/628e58dd68ef2b08e512a82d
   //!DELETE DATA FROM DATABASE
   app.delete('/delete-products/:id', async (req, res) => {
      const id = { _id: ObjectId(req.params.id) };

      const result = await productsCollection.deleteOne(id);

      //response e object pabo {acknowlege:true,deletedCount:1};
      res.send(result);
   });

   //new data add korle seta new add hoi ager gulo thake, put method id na milse se baniye dei and and new create kre, pathch thakle update krbe noy na,
   //link : http://localhost:5000/update-products/628e58dd68ef2b08e512a82d
   //!UPDATE DATABASE DATA
   app.put('/update-products/:id', async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const newProduct = req.body;
      // console.log(id,newPhone);

      /* const newProduct = {
         product_img: 'd2fdf',
         product_name: 'adnan khafdnadf  khan',
         product_price: 23430,
      }; */

      const options = {
         upsert: true,
      };
      const updateDoc = {
         $set: {
            ...newProduct,
         },
      };
      const result = await productsCollection.updateOne(filter, updateDoc, options);

      res.send(result);
   });

   //response result
   /*  {
            "acknowledged": true,
            "modifiedCount": 1,
            "upsertedId": null,
            "upsertedCount": 0,
            "matchedCount": 1
        } */
}
run().catch(console.dir);

//Test Api
app.get('/', (req, res) => {
   res.send('server response send = test successful');
});

app.listen(port, () => {
   console.log('server running on 5000 page');
});