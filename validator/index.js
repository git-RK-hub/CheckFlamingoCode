exports.userSignupValidator = (req, res, next) => {
  req
    .check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .matches(/^[a-zA-Z\-]+$/)
    .withMessage("only Alphabets are allowed in the firstName");
  req
    .check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .matches(/^[a-zA-Z\-]+$/)
    .withMessage("Only alphabets are allowed in the lastName");
  req
    .check("username")
    .notEmpty()
    .withMessage("User name is required")
    .matches(/^[A-Za-z0-9_]{3,20}$/)
    .withMessage(
      "For username only Alphabets and numbers are allowed. No special characters except underscore"
    );
  req
    .check("email")
    .notEmpty()
    .withMessage("Email name is required")
    .matches(
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    )
    .withMessage("Not a valid Email");
  req
    .check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("password must have atleast 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
exports.courseValidator = (req, res, next) => {
  for (const key in req.body) {
    if (key !== "tags" && key !== "prerequisites" && key !== "sems")
      req.body[key] = req.body[key].replace(/ +(?= )/g, "");
  }

  req
    .check("courseName")
    .notEmpty()
    .withMessage("Course Title is required")
    .matches(/^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 .#,+-]*$/)
    .withMessage(
      "Only Alphabets, number, spaces,+,-,. ,and  are allowed in the section Name and should not be empty"
    );
  req
    .check("description")
    .notEmpty()
    .withMessage("Description for the course is required");

  if (req.tags && req.category && req.skillLevel) {
    req
      .check("tags")
      .notEmpty()
      .withMessage("Please mention atleast one tag associated");
    req
      .check("category")
      .notEmpty()
      .withMessage("Please mention the category.");

    req
      .check("skillLevel")
      .notEmpty()
      .withMessage(
        "Please select a category of the skill level and should not be empty"
      );
  }
  if (req.department && req.sems) {
    req
      .check("sems")
      .notEmpty()
      .withMessage("Please mention atleast one Semester");
    req
      .check("departments")
      .notEmpty()
      .withMessage("Please mention the department.");
  }
  if (req.body.introUrl !== undefined && req.body.introUrl !== "")
    req
      .check("introUrl")
      .matches(/^(https?\:\/\/)?((www\.|m\.)?youtube\.com|youtu\.?be)\/.+$/)
      .withMessage("Not a valid youtube url please try again");
  for (const key in req.body) {
    if (key === "description") continue;
    if (req.body[key][0] === " ") req.body[key] = req.body[key].substring(1);
    if (req.body[key][req.body[key].length - 1] === " ")
      req.body[key] = req.body[key].substring(0, req.body[key].length - 1);
  }

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
exports.sectionValidator = (req, res, next) => {
  for (const key in req.body) {
    req.body[key] = req.body[key].replace(/ +(?= )/g, "");
  }

  req
    .check("sectionName")
    .notEmpty()
    .withMessage("Section Title is required")
    .matches(/^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 .#,+-]*$/)
    .withMessage(
      "Only Alphabets, number, spaces,+,-,. ,and  are allowed in the section Name and should not be empty"
    );
  req
    .check("description")
    .notEmpty()
    .withMessage("Description for the section is required")
    .matches(/^[A-Za-z0-9 ]*[A-Za-z0-9].*$/)
    .withMessage("Description should begin with an alphanumeric character");
  for (const key in req.body) {
    if (req.body[key][0] === " ") req.body[key] = req.body[key].substring(1);
    if (req.body[key][req.body[key].length - 1] === " ")
      req.body[key] = req.body[key].substring(0, req.body[key].length - 1);
  }

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
exports.subSectionValidator = (req, res, next) => {
  req
    .check("type")
    .notEmpty()
    .withMessage("Please mention the subSection Type");
  if (req.body.type === "lecture") {
    for (const key in req.body) {
      req.body[key] = req.body[key].replace(/ +(?= )/g, "");
    }
    req
      .check("lectureName")
      .notEmpty()
      .withMessage("Lecture Name is required")
      .matches(/^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 .#,+-]*$/)
      .withMessage(
        "Only Alphabets, number, spaces,+,-,. ,and  are allowed in the section Name and should not be empty"
      );
    req
      .check("youtubeURL")
      .notEmpty()
      .withMessage("please provide a youtubeURL")
      .matches(/^(https?\:\/\/)?((www\.|m\.)?youtube\.com|youtu\.?be)\/.+$/)
      .withMessage("Not a valid youtube url please try again");
    {
      req.body.description &&
        req
          .check("description")
          .matches(/^[A-Za-z0-9 ]*[A-Za-z0-9].*$/)
          .withMessage(
            "Description should begin with an alphanumeric character"
          );
    }
    for (const key in req.body) {
      if (req.body[key][0] === " ") req.body[key] = req.body[key].substring(1);
      if (req.body[key][req.body[key].length - 1] === " ")
        req.body[key] = req.body[key].substring(0, req.body[key].length - 1);
    }
  }
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
exports.emailValidator = (req, res, next) => {
  req
    .check("email")
    .notEmpty()
    .withMessage("Email name is required")
    .matches(
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    )
    .withMessage("Not a valid Email");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
exports.linkValidator = (req, res, next) => {
  req.check("link").notEmpty().withMessage("Link is required");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
