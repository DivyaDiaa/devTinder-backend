const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateUpdateFields = (req) => {
  const allowedFieldsEdit = ["lastName", "age", "location", "gender"];
  const isAllowedFields = Object.keys(req.body).every((field) =>
    allowedFieldsEdit.includes(field),
  );
  return isAllowedFields;
};

module.exports = {
  validateSignUpData,
  validateUpdateFields,
};
