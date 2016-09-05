const path = require('path');
const express = require('express');

const app = express();
const port = 9090;

// Static resources
app.use(express.static("./client/"));

// API routes
app.use('/api', require('./server/router/ApiRouter'));

// Default -> serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + "/client/", 'index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port);
});
