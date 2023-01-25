require('express-async-errors');
require('../../config/database')();
const express = require('express')
const morgan = require('morgan');
const route_teacher = require('./route.js');
const route_student = require('./route.js');
const teacherModel = require("../Model/teacher.js");
const error = require('../middlewares/error.middleware');
const { NotFoundError } = require('../errors/not_found_error');
const { JWT_SECRET } = require('../../config/envs');
const { expressjwt: jwt } = require('express-jwt');

module.exports = function (server) {


  server.use(morgan('common'));
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }));
  server.use(jwt({ secret: JWT_SECRET, algorithms: ['HS256'] })
    .unless({
      path: [
        '/api/v1/teacher/registerTeacher',
        '/api/v1/teacher/loginTeacher',
        '/api/v1/teacher/getAllTeacher',
        '/api/v1/student/registerStudent',
        '/api/v1/student/loginStudent',
        '/api/v1/student/getAllStudent',
      ],
    }));

  server.use(async (req, res, next) => {
    if (req.user && req.user.id) {
      req.user = await teacherModel.findById(req.user.id).select('-password');
    }
    next();
  });




  // Server Routes here
  server.use('/api/v1/teacher', route_teacher);
  server.use('/api/v1/student', route_student);


  // catch 404 and forward to error handler
  server.use(async () => {
    throw new NotFoundError('route Not Found');
  });
  // error handling middleware
  server.use(error);
}