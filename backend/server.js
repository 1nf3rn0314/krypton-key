const express = require("express");
require("dotenv").config();
const path = require("path");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const corsOptions = {
   origin: '*', 
   credentials: true,
   optionSuccessStatus: 200,
};

const client = new MongoClient(process.env.MONGO_URI);
const dbname = 'kryptonkey';

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

async function startServer() {
  try {
    await client.connect();
    const db = client.db(dbname);
    const colln = db.collection('passwords');

    // Get all passwords
    app.get('/api/get', async (req, res) => {
      const result = await colln.find({}).toArray();
      res.send(result);
    });

    // Insert a password
    app.post('/api/insert', async (req, res) => {
      console.log(req.body);
      await colln.insertOne(req.body)
        .then(() => res.json({"inserted": true}));
    });

    // Delete a password
    app.delete('/delete', async (req, res) => {
      console.log(req.body);
      await colln.deleteOne({id: req.body.id})
        .then(() => res.json({"deleted": true}));
    });

    // Update a password
    app.patch('/api/update', async (req, res) => {
      console.log(req.body);
      await colln.updateOne({id: req.body.id}, {$set : {
        website: req.body.website,
        username: req.body.username,
        password: req.body.password
      }}).then(() => res.json({"updated": true}));
    });

    app.listen(process.env.EXPRESS_PORT, () => {
      console.log(`Listening on port ${process.env.EXPRESS_PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
}

startServer();
