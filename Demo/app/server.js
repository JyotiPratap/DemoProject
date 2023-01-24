const express = require('express');

const server = express();

require('./routes/index')(server);


module.exports = server;
