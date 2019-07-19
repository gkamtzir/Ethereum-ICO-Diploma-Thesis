const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8080;

mongoose.connect("mongodb://localhost:27017/data", { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

// Establishing a conncetion with MongoDB.
db.once('open', function() {

    console.log('Connected');

});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));