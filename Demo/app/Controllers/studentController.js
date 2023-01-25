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
const {validateRegisteredField , validateLoginFeild} = require('../validators/student.validator');



class Student {
  async registerStudent(req, res) {
    logger.debug(`student Register api called for ${req.body}`);
    
    const {
      error: fielderror,
    } = validateRegisteredField(req.body);

    const {fname, lname, email, phone, password,teacherId} = req.body
    if (fielderror) {
      throw new InvalidInputError(
        fielderror.details[0].message,
        req.body
      );
    }
    const getTeacher =  await teacherModel.findById(teacherId);
    if(!getTeacher){
      logger.debug(`Teacher is  not found with : ${teacherId}`);
      throw new NotFoundError('Teacher is not present ');
    }
    
    const registeredData = { fname, lname, email, phone, password , teacherId }
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
    const findStudent = await studentModel.findOne({ email});

    if (!findStudent) {
      logger.debug(`student not found with this email : ${email}`);

      throw new NotFoundError('email not registered');
    }


    const isPasswordCorrect = await studentModel.findOne({password});
    if(!isPasswordCorrect){
      logger.debug(`student not found with this password : ${password}`);

      throw new NotFoundError('password not correct');
    }

    //Generate token
    let userId = findStudent._id;
    let token = await jwt.sign(
      {
        userId: userId,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN 
      });

      findStudent.set({ last_login_time: now(), invalid_attempts: 0 });
      findStudent.save();

    return res.status(200).json({
      userId, token
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

    let studentId = req.query.studentId;

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






// const studentModel = require("../Model/student.js");
// const teacherModel = require("../Model/teacher.js");
// const jwt = require("jsonwebtoken");
// const mongoose = require('mongoose');

// const isValidObjectId = function (objectId) {
//     return mongoose.Types.ObjectId.isValid(objectId)
// }

// const registerStudent = async (req, res) => {
//     try {
//         let requestBody = req.body

//         if (!(requestBody))
//             return res.status(400).json({status: false, msg: "Invalid request parameters ,please provide the user details",});

//         let { fname, lname, email, phone, password, teacherId } = requestBody;

//         if (!fname)
//             return res.status(400).json({ status: false, msg: "please provide the first name" });

//         if (!lname)
//             return res.status(400).json({ status: false, msg: "please provide the last name" });

//         if (!email)
//             return res.status(400).json({ status: false, msg: "please provide the email" });

//         if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
//             return res.status(400).json({ status: false, msg: "please provide a valid email address" });

//         let isEmailUsed = await studentModel.findOne({ email });

//         if (isEmailUsed)
//             return res.status(400).json({ status: false, msg: `${email} is already exists` });


//         if (!phone)
//             return res.status(400).json({ status: false, msg: "please provide the  phone number" });


//         if (!password)
//             return res.status(400).json({ status: false, msg: "please provide the password" });

//         if (!(password.length > 8 && password.length < 15))
//             return res.status(400).json({ status: false, msg: "password length should be 8-15??", });


//         if (!isValidObjectId(teacherId)) {
//             return res.status(400).json({ status: false, msg: "please provide valid teacher_Id" });

//         }

//         let teacher = await teacherModel.findById(teacherId)
//         if (!teacher) {
//             res.status(400).send({ status: false, msg: "No Such teacher is Present,Please check teacherId" })
//         }


//         const updatedBody = { fname, lname, email, phone, password, teacherId }
//         let user = await studentModel.create(updatedBody)
//         res.status(201).send({ status: true, message: 'Student  created successfully', data: user })

//     } catch (err) {
//         res.status(500).json({ status: false, msg: err.message });
//     }
// };



// const login = async (req, res) => {
//     try {
//         if (!(req.body))
//             return res.status(400).json({ status: false, msg: "invalid paramaters please provide email-password", });

//         let { email, password } = req.body;

//         if (!email)
//             return res.status(400).json({ status: false, msg: "email is required" });

//         if (!password)
//             return res.status(400).json({ status: false, msg: "password is required" });


//         const findStudent = await studentModel.findOne({ email });

//         if (!findStudent) {
//             return res.status(401).send({ status: false, message: `Login failed! email is incorrect.` });
//         }

//         const pass = await studentModel.findOne({ password });

//         if (!pass) {
//             return res.status(401).send({ status: false, message: `Login failed! Password is incorrect.` });
//         }

//         let userId = findStudent._id;

//         let token = await jwt.sign(
//             {
//                 userId: userId,
//             },
//             "Key-1"
//         );

//         res.status(200).json({ status: true, msg: "Student loggedin successfully", data: { userId, token }, });
//     } catch (err) {
//         res.status(500).json({ status: false, msg: err.message });
//     }
// };

// const getAllStudent = async (req, res) => {
//     try {
//         var getAll = await studentModel.find();

//         if (!getAll) {
//             return res.status(401).json({ status: false, msg: "There is no Teacher register right Now" });
//         }

//         res.status(200).send({ status: true, message: 'GetAllStudent successfully', getAllStudent: getAll })

//     }
//     catch (err) {
//         res.status(500).json({ status: false, msg: err.message });
//     }
// }



// const getStudentById = async (req, res) => {
//     try {
//       let studentId = req.query.studentId;
//       if (!studentId) {
//         return res.status(400).json({ status: false, msg: "Please provide studentId" });
//       }
  
//       const student = await studentModel.findOne({ _id: studentId, isDeleted: false });
  
//       if (!student) {
//         return res.status(404).send({ status: false, message: `student does not exists` })
//       }
  
//       return res.status(200).send({ status: true, message: 'student found successfully', data: teacher })
  
//     }
//     catch (err) {
//       res.status(500).json({ status: false, msg: err.message });
//     }
//   }


// module.exports.registerStudent = registerStudent
// module.exports.login = login
// module.exports.getAllStudent = getAllStudent
// module.exports.getStudentById = getStudentById






