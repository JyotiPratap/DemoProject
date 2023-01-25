const express = require('express');
const router = express.Router();
const Teacher = require('../Controllers/teacherController')
const Student = require("../Controllers/studentController")

const teacher = new Teacher();
const student = new Student();



router.post('/registerTeacher', teacher.registerTeacher);
router.post('/loginTeacher', teacher.login);
router.get('/getAllTeacher', teacher.getAllTeacher);
router.get('/getTeacherById/:teacherId', teacher.getTeacherById);


router.post('/registerStudent', student.registerStudent)
router.post('/loginStudent', student.login);
router.get('/getAllStudent', student.getAllStudent)
router.get('/getStudentById/:studentId', student.getStudentById);



module.exports = router;