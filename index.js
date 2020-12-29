const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fileupload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('services'));
app.use(fileupload());


const port = process.env.PORT || 8080 ;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bv33z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("myNodeJsbd").collection("creative-agency-main");
  
  app.get('/allData', (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  });
  
  app.post('/addServices', (req, res) => {
    const data = req.body;
    collection.insertOne(data)
    .then((result) => {
      res.end();
    });
  });
  
  app.post('/upload', (req, res) => {
    if (req.files) {
      console.log(req.files);
    }
  });

  console.log('database connection succeeded');
  // client.close();
});

app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(port);


