const express = require('express');
const router = express.Router();
const Teacher = require('../Controllers/teacherController')
const Student = require("../Controllers/studentController")

const teacher = new Teacher();
const student = new Student();



router.post('/registerTeacher', teacher.registerTeacher);
router.post('/login', teacher.login);
router.get('/getAllTeacher', teacher.getAllTeacher);
router.get('/getTeacherById/:teacherId',teacher.getTeacherById);


router.post('/registerStudent', student.registerStudent)
router.post('/login', student.login)
router.get('/getAllStudent', student.getAllStudent)









// router.post('/loginTeacher', teacherController.login)
// router.get('/getAllTeacher', teacherController.getAllTeacher);
// router.get('/getTeacherById/:teacherId',middleware.authorization,teacherController.getTeacherById);


// router.post('/registerStudent', studentController.registerStudent)
// router.post('/loginStudent', studentController.login)
// router.get('/getAllStudent', middleware.authentication, studentController.getAllStudent);
// router.get('/getStudentById/:studentId',middleware.authorization,studentController.getStudentById);




module.exports = router;