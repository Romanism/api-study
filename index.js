const express = require('express');
const app = express();
// const MongoClient = require('mongodb').MongoClient;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8080, function () {
  console.log('listening on 8080');
});

app.get('/', function (request, response) {
  response.send('Hello, World!');
});

app.post('/api/users/login', function (request, response) {
  response.send(request.body);
});

app.post('/api/users', function (request, response) {
  response.send(request.body);
});
