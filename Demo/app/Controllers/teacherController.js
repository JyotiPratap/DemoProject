const jwt = require("jsonwebtoken")
const teacherModel = require("../Model/teacher.js");
const logger = require("log4js").getLogger("hii")
const { now } = require('lodash');
const {
  JWT_SECRET, JWT_EXPIRES_IN,
} = require('../../config/envs');

const { NotFoundError } = require('../errors/not_found_error');
const { InvalidInputError } = require('../errors/invalid_input_error');
const { validateRegisteredField, validateLoginFeild } = require('../validators/teacher.validator');



class Teacher {

  async registerTeacher(req, res) {
    logger.debug(`teacher Register api called for ${req.body}`);

    const {
      error: fielderror,
    } = validateRegisteredField(req.body);

    const { fname, lname, email, phone, password } = req.body

    if (fielderror) {
      throw new InvalidInputError(
        fielderror.details[0].message,
        req.body
      );
    }

    const registeredData = { fname, lname, email, phone, password }
    const regiTeacher = await teacherModel.create(registeredData)

    regiTeacher.save();

    return res.status(201).json({
      regiTeacher: regiTeacher
    });
  };




  async login(req, res) {
    console.log("jj");
    logger.debug(`teacher login api called for ${req.body}`);

    const {
      error: fielderror,
    } = validateLoginFeild(req.body);

    const { email, password } = req.body
    if (fielderror) {
      throw new InvalidInputError(
        fielderror.details[0].message,
      );
    }
    const findTeacher = await teacherModel.findOne({ email });

    if (!findTeacher) {
      logger.debug(`teacher not found with this email : ${email}`);

      throw new NotFoundError('email not registered');
    }


    const isPasswordCorrect = await teacherModel.findOne({ password });
    if (!isPasswordCorrect) {
      logger.debug(`teacher not found with this password : ${password}`);

      throw new NotFoundError('password not correct');
    }

    //Generate token
    let teacherId = findTeacher._id;
    let token = await jwt.sign(
      {
        teacherId: teacherId,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN
      });

    findTeacher.set({ last_login_time: now(), invalid_attempts: 0 });
    findTeacher.save();

    return res.status(200).json({
      teacherId, token
    })

  }




  async getAllTeacher(req, res) {
    logger.debug(`getAll teacher api call`);
    const getAllteacher = await teacherModel.find({});

    return res.status(200).json({
      getAllteacher: getAllteacher
    })
  }




  async getTeacherById(req, res) {
    logger.debug(`get teacherById api call`);

    let teacherId = req.query.teacherId;

    const teacher = await teacherModel.findOne({ _id: teacherId, isDeleted: false })
    if (!teacher) {
      throw new NotFoundError('teacher not found');
    }
    return res.status(200).json({
      teacher: teacher
    })

  }

}
module.exports = Teacher