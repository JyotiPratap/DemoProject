// const express = require('express');
// var bodyParser = require('body-parser');
// const mongoose = require("mongoose")
// const route = require('./Demo/src/routes/route.js');

// const app = express();

// app.use(bodyParser.json());

// app.use('/', route);

// // mongodb://localhost:27017/test1
// mongoose.connect("mongodb+srv://rubygupta7505:GDDYMfHDEGehjUj0@cluster0.xf64f.mongodb.net/DemoProject1" )
//     .then(() => console.log('mongodb is connected'))
//     .catch(err => console.log(err))

 
// app.listen(3000, function() {
//     console.log('Express is running on port 3000');
// })



require("dotenv").config();
const log4js = require('log4js');
const server = require('./app/server');
const conf = require('./config/logConfig');
// const mongoose = require("mongoose")

const unhandledError = require('./app/utils/unhandledError');

const { PORT } = require('./config/envs');

log4js.configure(conf);

// mongoose.connect("mongodb+srv://rubygupta7505:GDDYMfHDEGehjUj0@cluster0.xf64f.mongodb.net/DemoProject1" )
//     .then(() => console.log('mongodb is connected'))
//     .catch(err => console.log(err))

server.listen(PORT, async () => {
  unhandledError.catchingUnhandledError();
  console.log(`Server started on port ${PORT}`);
});
