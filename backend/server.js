import express from "express"
import "dotenv/config"
import { MongoClient } from "mongodb"
import cors from "cors"
const corsOptions = {
   origin: '*', 
   credentials: true,
   optionSuccessStatus: 200,
}

const client = new MongoClient(process.env.MONGO_URI)
const dbname = 'kryptonkey'

const app = express()
app.use(express.json())
app.use(cors(corsOptions))

await client.connect()
const db = client.db(dbname)
const colln = db.collection('passwords')

// Get all passwords
app.get('/', async (req, res) => {
  const result = await colln.find({}).toArray()
  res.send(result)
})

// Insert a password
app.post('/', async (req, res) => {
  console.log(req.body)
  await colln.insertOne(req.body)
    .then(res.json({"inserted": true}))
})

// Delete a password
app.delete('/', async (req, res) => {
  console.log(req.body)
  await colln.deleteOne({id: req.body.id})
    .then(res.json({"deleted": true}))
})

// Update a password
app.patch('/', async (req, res) => {
  console.log(req.body)
  await colln.updateOne({id: req.body.id}, {$set : {
    website: req.body.website,
    username: req.body.username,
    password: req.body.password
  }}).then(res.json({"updated": true}))
})

app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Example app listening on port ${process.env.EXPRESS_PORT}`)
})
