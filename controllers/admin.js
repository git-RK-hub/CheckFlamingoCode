const Instructor = require("../models/instructor");
const User = require("../models/user");
const Course = require("../models/course");
const Admin = require("../models/admin");
const Admin1 = require("../models/admin1");
const ClassModel = require("../models/classModel");
const Blog = require("../models/blog");
const redis = require("redis");
const csv = require("csvtojson");
const formidable = require("formidable");
const { errorHandler } = require("../helpers/dbErrorHandler");
const validUrl = require("valid-url");
const {
  sendEmailInstructor,
  sendEmailAdmin,
  sendEmailb2bUser
} = require("../helpers/emailHandler");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../helpers/tokensHandler");
const { response } = require("express");
const client = redis.createClient({});
client.on("connect", function () {
  console.log("connected to redis for admin");
});
const path = require("path");
const fs = require("fs");
let { s3 } = require("../helpers/aws");
const admin1 = require("../models/admin1");

exports.checkAdmin = function (req, res, next) {
  Admin.findOne({ username: req.body.username }, (err, doc) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    if (doc)
      return res
        .status(400)
        .json({ error: "Username already used please try other one" });
    Admin.findOne({ email: req.body.email }, (err, doc) => {
      if (err) return res.status(400).json({ error: err });
      if (doc)
        return res.status(400).json({
          error: "Email already used please try signingnup with a new one"
        });
      if (!doc) next();
    });
  });
};

exports.checkAdminbyEmail = function (req, res, next) {
  Admin.findOne({ email: req.body.email }, (err, admin) => {
    if (err) return res.status(400).json({ error: err });
    if (admin)
      return res
        .status(400)
        .json("Hey already a user account exists please try another email id");
    if (!admin) next();
  });
};
exports.checkLink = function (req, res, next) {
  if (!validUrl.isUri(req.body.link)) {
    return res.status(400).json({ error: "Not a valid link" });
  } else {
    next();
  }
};
exports.createInstructor = function (req, res) {
  req.body.username = req.body.email;
  req.body.password = req.body.email;
  const instructor = new Instructor({
    ...req.body,
    createdDate: new Date()
  });
  instructor.save((err, doc) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    const response = sendEmailInstructor(doc.email, req.get("host"));
    console.log(response);
    if (response.error)
      return res.status(400).json({ error: "Something wrong with mailer" });
    else
      return res.status(200).json({
        doc,
        message: "Email Link to signup has been sent to the provided email Id."
      });
  });
};

exports.createClass = async (req, res) => {
  const findClass = await ClassModel.findOne({
    $and: [
      { ofClass: req.body.ofClass },
      { classSection: req.body.classSection }
    ]
  });
  if (!findClass) {
    const doc = await ClassModel.create(req.body);
    res.status(200).json({
      status: "Success",
      doc
    });
  } else {
    return res.status(400).json({
      message: "This class already exists"
    });
  }
};

exports.createAdmin = function (req, res) {
  req.body.username = req.body.email;
  req.body.password = req.body.email;
  const admin = new Admin({
    ...req.body,
    createdDate: new Date()
  });
  admin.save((err, doc) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    const response = sendEmailAdmin(doc.email, req.get("host"));
    console.log(response);
    if (response.error)
      return res.status(400).json({ error: "Something wrong with mailer" });
    else
      return res.status(200).json({
        doc,
        message: "Email Link to signup has been sent to the provided email Id."
      });
  });
};
exports.createAdmin3 = function (req, res) {
  req.body.username = req.body.email;
  req.body.password = req.body.email;
  const admin = new Admin({
    ...req.body,
    createdDate: new Date()
  });
  admin.save((err, doc) => {
    if (err) return res.status(400).json({ error: err });
    const response = sendEmailAdmin(doc.email, req.get("host"));
    console.log(response);
    if (response.error)
      return res.status(400).json({ error: "Something wrong with mailer" });
    else
      return res.status(200).json({
        doc,
        message: "Email Link to signup has been sent to the provided email Id."
      });
  });
};

exports.adminSignup = function (req, res) {
  admin = req.admin;
  if (admin.email !== req.body.email)
    return res.status(400).json({
      error:
        "Please try to signup using the same mail id previously provided to the team flamingo"
    });
  admin.email = req.body.email;
  admin.username = req.body.username;
  admin.password = req.body.password;
  admin.active = true;
  admin.hash = null;
  admin.save((err, doc) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else return res.status(200).json({ message: "Admin created" });
  });
};
exports.parseBlogFields = (req, res, next) => {
  let fileName;
  let currentDate = Date.now();
  let form = new formidable.IncomingForm({});
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: err });
    let file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file chosen" });
    }
    fileName = files.file.name;
    fileName.replace(/ /g, "_");

    let filePath = files.file.path;
    var params = {
      Bucket: "flamingospaces",
      Key: path.basename(`${currentDate}_${files.fileName}`),
      Body: fs.createReadStream(filePath),
      ACL: "public-read"
    };
    s3.upload(params, function (err, data) {
      if (err) {
        return res.status(400).json({ error: "Something went wrong" });
      } else {
        for (const property in fields) {
          req.body[property] = fields[property];
        }
        req.body.imgUrl = `https://flamingospaces.sgp1.digitaloceanspaces.com/${currentDate}_${files.fileName}`;
        next();
      }
    });
  });
};
exports.createBlogByLink = (req, res, next) => {
  const blog = new Blog(req.body);
  console.log(req.admin.level);
  if (req.admin.level === 1) blog.active = true;
  blog.save((err, response) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: errorHandler(err) });
    } else if (req.admin.level === 1)
      return res.status(200).json({ message: "Blog created" });
    else {
      req.blog = response;
      next();
    }
  });
};
exports.createBlogByContent = (req, res, next) => {
  const blog = new Blog({ ...req.body, createdDate: new Date() });
  console.log(req.admin.level);
  if (req.admin.level === 1) blog.active = true;
  blog.save((err, response) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else if (req.admin.level === 1)
      return res.status(200).json({ message: "Blog created" });
    else {
      console.log("reached here");
      req.blog = response;
      next();
    }
  });
};
exports.adminAcceptBlog = (req, res) => {
  Admin1.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    let admin1 = data[0];
    admin1.blogPermissions.push({ blog: req.blog });
    admin1.save((err, doc) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      else
        return res.status(200).json({
          message: "Blog created and approval request will be sent to Admin1"
        });
    });
  });
};
exports.adminRead = (req, res) => {
  return res.status(200).json(req.admin);
};
exports.isAdmin3 = (req, res, next) => {
  console.log(req.auth);
  let admin =
    req.admin &&
    req.auth &&
    req.admin.level <= 3 &&
    Date.now() < req.auth.exp * 1000 &&
    req.admin._id == req.auth.id;
  if (!admin) return res.status(403).json({ error: "Access Forbidden " });
  next();
};
exports.isAdmin2 = (req, res, next) => {
  let admin =
    req.admin &&
    req.auth &&
    req.admin.level <= 2 &&
    Date.now() < req.auth.exp * 1000 &&
    req.admin._id == req.auth.id;
  if (!admin) return res.status(403).json({ error: "Access Forbidden " });
  next();
};
exports.isAdmin1 = (req, res, next) => {
  let admin =
    req.admin &&
    req.auth &&
    req.admin.level === 1 &&
    Date.now() < req.auth.exp * 1000 &&
    req.admin._id == req.auth.id;

  if (!admin) return res.status(403).json({ error: "Access Forbidden " });
  next();
};

exports.adminById = (req, res, next, id) => {
  Admin.findById(id).exec((err, admin) => {
    if (err || !admin)
      return res.status(400).json({ error: "Admin not found" });
    req.admin = admin;
    next();
  });
};

exports.adminSignin = function (req, res) {
  const { username, password } = req.body;
  Admin.findOne({ username }, (err, admin) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });

    if (!admin) {
      return res.status(400).json({ error: "No such User exits" });
    }
    if (!admin.authenticate(password)) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    res.cookie("t", token, refreshToken, { expire: new Date() + 9999 });
    const { _id, name, username, level } = admin;
    client.get(JSON.stringify(admin._id), function (err, reply) {
      if (err) {
        return res.status(400).json({ error: err });
      } else if (!reply) {
        let refreshTokens = [];
        refreshTokens.push(refreshToken);
        client.setex(
          JSON.stringify(admin._id),
          3600,
          JSON.stringify(refreshTokens)
        );
      } else {
        //console.log("A login present");
        let refreshTokensrecieved = JSON.parse(reply);
        //console.log(refreshTokensrecieved);
        if (refreshTokensrecieved.length >= 5) refreshTokensrecieved = [];
        refreshTokensrecieved.push(refreshToken);
        client.setex(
          JSON.stringify(admin._id),
          3600,
          JSON.stringify(refreshTokensrecieved)
        );
      }
      let role = "admin";
      return res.status(200).json({
        token,
        refreshToken,
        user: { _id, username, name, role, level }
      });
    });
  });
};
exports.parseCSV = function (req, res, next) {
  let form = new formidable.IncomingForm({});
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: err });
    let file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file chosen" });
    }
    let filePath = files.file.path;
    csv()
      .fromFile(filePath)
      .then((response) => {
        req.data = response;
        for (const property in fields) {
          req.body[property] = fields[property];
        }
        next();
      })
      .catch((err) => {
        return res.status(400).json({ error: "Something went wrong" });
      });
  });
};

exports.checkAllUserEmails = async function (req, res, next) {
  let data = req.data2;
  let indexes = [];

  for (let index = 0; index < data.length; index++) {
    try {
      const numFruit = await User.findOne(
        { email: data[index].email },
        (err, user) => {
          if (err) {
            check = 0;
            return res.status(400).json({ error: err });
          }
          if (user) {
            indexes.push(data[index].index + 2);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  req.indexes = indexes;
  next();
};
exports.checkAllAdminEmails = async function (req, res, next) {
  let data = req.data2;
  let indexes = req.indexes;
  for (let index = 0; index < data.length; index++) {
    try {
      const numFruit = await Admin.findOne(
        { email: data[index].email },
        (err, user) => {
          if (err) {
            check = 0;
            return res.status(400).json({ error: err });
          }
          if (user) {
            indexes.push(data[index].index + 2);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  next();
};
exports.checkAllInstructorEmails = async function (req, res, next) {
  let data = req.data2;
  let indexes = req.indexes;
  for (let index = 0; index < data.length; index++) {
    try {
      const numFruit = await Admin.findOne(
        { email: data[index].email },
        (err, user) => {
          if (err) {
            check = 0;
            return res.status(400).json({ error: err });
          }
          if (user) {
            indexes.push(data[index].index + 2);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  next();
};
exports.checkForDups = (req, res, next) => {
  let dupes = {};
  let array = req.data;
  req.data2 = [];
  req.duplicates = "";
  array.forEach((item, index) => {
    item.index = index;
    dupes[item.email] = dupes[item.email] || [];
    dupes[item.email].push(index);
  });
  for (let name in dupes) {
    let temp = { ...dupes[name] };
    let index = temp[Object.keys(temp)[0]];
    req.data2.push(array[index]);
    console.log(index, typeof index);

    if (dupes[name].length > 1)
      req.duplicates +=
        "This email " +
        name +
        " has been repeated at indexes " +
        dupes[name] +
        ". Total " +
        dupes[name].length +
        " times. Only one will be considered.";
  }
  console.log(req.data2);
  next();
};
exports.createMultiUsers = async function (req, res) {
  let check = 1;
  let data = req.data2;
  for (let index = 0; index < data.length; index++) {
    if (req.indexes.indexOf(data[index].index + 2) !== -1) continue;
    try {
      let temp = [];
      req.body.username = data[index].email;
      req.body.password = data[index].email;
      req.body.email = data[index].email;
      const getMyCourses = await Course.find({
        university: req.body.university,
        b2c: false,
        departments: req.body.department,
        sems: { $in: [req.body.sem] }
      });
      console.log(getMyCourses);
      for (let index = 0; index < getMyCourses.length; index++) {
        console.log(getMyCourses[index]);
        temp.push({ course: getMyCourses[index] });
      }
      console.log(req.body);
      const user = new User({
        ...req.body,
        myCoursesList: temp,
        createdDate: new Date()
      });

      if (check) {
        const numFruit = await user.save((err, doc) => {
          if (err) {
            check = 0;
            return res.status(400).json({ error: err });
          } else {
            const response = sendEmailb2bUser(doc.email, req.get("host"));
            console.log(response);
            if (response.error) {
              check = 0;
              return res
                .status(400)
                .json({ error: "Something wrong with mailer" });
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  if (check) {
    let message =
      "Created user accounts for the mails provided. Signup mails have been sent to the email provided";
    return res.status(200).json({
      message: message,
      duplicates: req.indexes,
      dups: req.duplicates
    });
  }
};
exports.adminCoursePermissions = function (req, res) {
  Admin1.find()
    .populate("coursePermissions.course")
    .exec((err, data) => {
      if (err) return res.status(400).json({ error: err });
      else
        return res
          .status(200)
          .json({ coursePermissions: data[0].coursePermissions });
    });
};
exports.adminCourseApprovalPermissions = function (req, res) {
  Admin1.find()
    .populate("courseApprovedPermissions.course")
    .exec((err, data) => {
      if (err) return res.status(400).json({ error: err });
      else
        return res.status(200).json({
          courseApprovedPermissions: data[0].courseApprovedPermissions
        });
    });
};

exports.adminBlogPermissions = function (req, res) {
  Admin1.find()
    .populate("blogPermissions.blog")
    .exec((err, data) => {
      if (err) return res.status(400).json({ error: err });
      else
        return res
          .status(200)
          .json({ blogPermissions: data[0].blogPermissions });
    });
};
exports.changeApprovedCourseStatus = function (req, res) {
  let course = req.course;
  Admin1.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: err });
    else {
      let messages = data[0];
      let index = messages.courseApprovedPermissions.findIndex((obj) => {
        return obj.course.toString() == course._id;
      });
      messages.courseApprovedPermissions.splice(index, 1);
      if (req.body.approved) {
        let tempDup = JSON.parse(JSON.stringify(course.dup));
        for (const key in tempDup) {
          if (key in course) course[key] = tempDup[key];
        }
      } else course.dup = JSON.parse(JSON.stringify(course));
      course.dupActive = false;
      course.save((err, resCourse) => {
        if (err) return res.status(400).json({ error: err });
        else {
          messages.save((err, status) => {
            if (err) return res.status(400).json({ error: err });
            return res.status(200).json({
              message: "The course Updates has been approved/rejected"
            });
          });
        }
      });
    }
  });
};

exports.changeCourseStatus = function (req, res) {
  console.log("came here");
  const course = req.course;
  Admin1.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: err });
    else {
      let messages = data[0];
      let index = messages.coursePermissions.findIndex((obj) => {
        return obj.course.toString() == course._id;
      });
      messages.coursePermissions[index].status = req.body.approved;
      course.approved = req.body.approved;
      if (course.approved === true) {
        let coursedup = JSON.parse(JSON.stringify(course));
        course.dup = coursedup;
      }
      course.save((err, resCourse) => {
        if (err) return res.status(400).json({ error: err });
        else {
          messages.save((err, status) => {
            if (err) return res.status(400).json({ error: err });
            return res
              .status(200)
              .json({ message: "The course has been approved/rejected" });
          });
        }
      });
    }
  });
};

exports.changeBlogStatus = function (req, res) {
  const blog = req.blog;
  blog.active = req.body.approved;
  Admin1.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: err });
    else {
      let messages = data[0];
      console.log(messages);
      let index = messages.blogPermissions.findIndex((obj) => {
        console.log(obj.blog.toString(), blog._id);
        return obj.blog.toString() == blog._id;
      });
      console.log(index);
      messages.blogPermissions[index].status = req.body.approved;
      blog.save((err, resCourse) => {
        if (err) return res.status(400).json({ error: err });
        else {
          messages.save((err, status) => {
            if (err) return res.status(400).json({ error: err });
            return res
              .status(200)
              .json({ message: "The Blog has been approved/rejected" });
          });
        }
      });
    }
  });
};
exports.universities = function (req, res) {
  let unis = [];
  Admin.find({ level: 3 }).exec((err, response) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else {
      response.forEach((element) => {
        unis.push(element.university);
      });
      return res.status(200).json(unis);
    }
  });
};
exports.universitiesDepts = function (req, res) {
  let unis = [];
  Admin.find({ level: 3 }).exec((err, response) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else {
      response.forEach((element) => {
        unis.push({ uni: element.university, depts: element.departments });
      });
      return res.status(200).json(unis);
    }
  });
};

exports.departments = function (req, res) {
  Admin.findOne(
    { level: 3, university: req.body.university },
    (err, response) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      else {
        return res.status(200).json(response.departments);
      }
    }
  );
};

exports.setCoursePrice = function (req, res) {
  const course = req.course;
  course.price = req.body.price;
  course.discount = req.body.discount;
  if (course.discount === 100) course.courseType = "Free";
  else course.courseType == "Paid";
  course.save((err, resCourse) => {
    if (err) return res.status(400).json({ error: err });
    else {
      return res
        .status(400)
        .json({ message: "Price and discount have been set" });
    }
  });
};
exports.hashIdAdmin = function (req, res, next) {
  Admin.findOne({ hash: req.params.hashId }, (err, doc) => {
    if (err) return res.status(400).json({ error: err });
    if (!doc) return res.status(400).json({ error: "Not a valid route" });
    if (doc) {
      req.admin = doc;
      next();
    }
  });
};
