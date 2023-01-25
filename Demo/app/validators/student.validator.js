const Joi = require('joi');

function validateRegisteredField(student) {
  const message = 'Password must be of atleast 8 characters. '
  + 'It should have One UpperCase,One LowerCase,One Number and One SpecialCase Character';
  const schema = Joi.object({
    fname: Joi.string().max(50).min(1).required(),
    lname: Joi.string().max(50).min(1).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(30).min(1).required(),
    teacherId: Joi.string().required(),
    password: Joi.string().required()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/)
      .message(message),
  });
  const result = schema.validate(student);
  return result;
}


function validateLoginFeild(student) {
  const message = 'Password must be of atleast 8 characters. '
  + 'It should have One UpperCase,One LowerCase,One Number and One SpecialCase Character';
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/)
      .message(message),
  });
  const result = schema.validate(student);
  return result;
}

module.exports= {validateRegisteredField,validateLoginFeild};
