const jwt = require("jsonwebtoken")
const teacherModel = require("../Model/teacher.js");
const logger = require("log4js").getLogger("hii")
const { now } = require('lodash');
const {
  JWT_SECRET, JWT_EXPIRES_IN,
} = require('../../config/envs');


const { InvalidInputError } = require('../errors/invalid_input_error');
const { validateRegisteredField ,validateLoginFeild} = require('../validators/teacher.validator');



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
    const findTeacher = await teacherModel.findOne({ email});

    if (!findTeacher) {
      logger.debug(`teacher not found with this email : ${email}`);

      throw new NotFoundError('email not registered');
    }


    const isPasswordCorrect = await teacherModel.findOne({password});
    if(!isPasswordCorrect){
      logger.debug(`teacher not found with this password : ${password}`);

      throw new NotFoundError('password not correct');
    }

    //Generate token
    let userId = findTeacher._id;
    let token = await jwt.sign(
      {
        userId: userId,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN 
      });

      findTeacher.set({ last_login_time: now(), invalid_attempts: 0 });
      findTeacher.save();

    return res.status(200).json({
      userId, token
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







// const login = async (req, res) => {
//   try {
//     if (!(req.body))
//       return res.status(400).json({ status: false, msg: "invalid paramaters please provide email-password", });

//     let { email, password } = req.body;

//     if (!email)
//       return res.status(400).json({ status: false, msg: "email is required" });


//     if (!password) {
//       return res.status(400).json({ status: false, msg: "password is required" })
//     }

//     const findTeacher = await teacherModel.findOne({ email });

//     if (!findTeacher) {
//       return res.status(401).send({ status: false, message: `Login failed! email is incorrect.` });
//     }

//     const pass = await teacherModel.findOne({ password });

//     if (!pass) {
//       return res.status(401).send({ status: false, message: `Login failed! Password is incorrect.` });
//     }

//     let userId = findTeacher._id;

//     let token = await jwt.sign(
//       {
//         userId: userId,
//       },
//       "Key-1"
//     );

//     res.status(200).json({ status: true, msg: "Teacher loggedin successfully", data: { userId, token }, });
//   } catch (err) {
//     res.status(500).json({ status: false, msg: err.message });
//   }
// };


// const getAllTeacher = async (req, res) => {
//   try {
//     var getAll = await teacherModel.find({});

//     if (!getAll) {
//       return res.status(401).json({ status: false, msg: "There is no Teacher register right Now" });
//     }

//     res.status(200).send({ status: true, message: 'GetAllTeacher successfully', AllTeacher: getAll })

//   }
//   catch (err) {
//     res.status(500).json({ status: false, msg: err.message });
//   }
// }


// const getTeacherById = async (req, res) => {
//   try {
//     let teacherId = req.query.teacherId;
//     if (!teacherId) {
//       return res.status(400).json({ status: false, msg: "Please provide teacherId" });
//     }

//     const teacher = await teacherModel.findOne({ _id: teacherId, isDeleted: false });

//     if (!teacher) {
//       return res.status(404).send({ status: false, message: `teacher does not exists` })
//     }

//     return res.status(200).send({ status: true, message: 'Teacher found successfully', data: teacher })

//   }
//   catch (err) {
//     res.status(500).json({ status: false, msg: err.message });
//   }
// }






// module.exports.login = login
// module.exports.getAllTeacher = getAllTeacher
// module.exports.getTeacherById = getTeacherById