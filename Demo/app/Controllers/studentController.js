const jwt = require("jsonwebtoken")
const studentModel = require("../Model/student.js");
const teacherModel = require("../Model/teacher.js");
const logger = require("log4js").getLogger("hii")
const { now } = require('lodash');
const {
  JWT_SECRET, JWT_EXPIRES_IN,
} = require('../../config/envs');


const { NotFoundError } = require('../errors/not_found_error');
const { InvalidInputError } = require('../errors/invalid_input_error');
const { validateRegisteredField, validateLoginFeild } = require('../validators/student.validator');



class Student {
  async registerStudent(req, res) {
    logger.debug(`student Register api called for ${req.body}`);

    const {
      error: fielderror,
    } = validateRegisteredField(req.body);

    const { fname, lname, email, phone, password, teacherId } = req.body
    if (fielderror) {
      throw new InvalidInputError(
        fielderror.details[0].message,
        req.body
      );
    }
    const getTeacher = await teacherModel.findById(teacherId);
    if (!getTeacher) {
      logger.debug(`Teacher is  not found with : ${teacherId}`);
      throw new NotFoundError('Teacher is not present ');
    }

    const registeredData = { fname, lname, email, phone, password, teacherId }
    const regiStudent = await studentModel.create(registeredData)

    regiStudent.save();

    return res.status(201).json({
      regiStudent: regiStudent
    });
  };




  async login(req, res) {
    logger.debug(`student login api called for ${req.body}`);

    const {
      error: fielderror,
    } = validateLoginFeild(req.body);

    const { email, password } = req.body
    if (fielderror) {
      throw new InvalidInputError(
        fielderror.details[0].message,
      );
    }
    const findStudent = await studentModel.findOne({ email });

    if (!findStudent) {
      logger.debug(`student not found with this email : ${email}`);

      throw new NotFoundError('email not registered');
    }


    const isPasswordCorrect = await studentModel.findOne({ password });
    if (!isPasswordCorrect) {
      logger.debug(`student not found with this password : ${password}`);

      throw new NotFoundError('password not correct');
    }

    //Generate token
    let studentId = findStudent._id;
    let token = await jwt.sign(
      {
        studentId: studentId,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN
      });

    findStudent.set({ last_login_time: now(), invalid_attempts: 0 });
    findStudent.save();

    return res.status(200).json({
      studentId, token
    })

  }


  async getAllStudent(req, res) {
    logger.debug(`getAll teacher api call`);
    const getAllStudent = await studentModel.find({});

    return res.status(200).json({
      getAllStudent: getAllStudent
    })
  }



  async getStudentById(req, res) {
    logger.debug(`get teacherById api call`);

    let studentId = req.params.studentId;

    const student = await studentModel.findOne({ _id: studentId, isDeleted: false })
    if (!student) {
      throw new NotFoundError('student not found');
    }
    return res.status(200).json({
      student: student
    })

  }




}
module.exports = Student





