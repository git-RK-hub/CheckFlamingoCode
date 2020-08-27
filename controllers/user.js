const User = require("../models/user");
const Course = require("../models/course");
const Instructor = require("../models/instructor");
const ClassModel = require("../models/classModel");

const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
var mongoose = require("mongoose");
let { s3 } = require("../helpers/aws");
const { errorHandler } = require("../helpers/dbErrorHandler");
exports.signUpb2bUser = function (req, res) {
  let user = req.user;
  if (instructor.email !== req.body.email)
    return res.status(400).json({
      error:
        "Please try to signup ususerng the same mail id previously provided to the team flamingo"
    });
  user.email = req.body.email;
  user.username = req.body.username;
  user.password = req.body.password;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.active = true;
  user.hash = null;
  user.save((err, doc) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else return res.status(200).json({ message: "user created" });
  });
};

exports.myCourses = (req, res) => {
  let courses = [];
  User.findById(req.profile._id)
    .populate("myCoursesList.course")
    .exec((err, user) => {
      if (err) return res.status(400).json({ error: err });
      for (let index = 0; index < user.myCoursesList.length; index++)
        if (
          user.myCoursesList[index].course.disabled !== undefined &&
          user.myCoursesList[index].course.disabled === false
        )
          courses.push(user.myCoursesList[index].course);
      return res.status(200).json(courses);
    });
};
exports.myCoursesCats = (req, res) => {
  let mySet = new Set();
  let cats;

  User.findById(req.profile._id)
    .populate("myCoursesList.course")
    .exec((err, user) => {
      if (err) return res.status(400).json({ error: err });
      for (let index = 0; index < user.myCoursesList.length; index++)
        mySet.add(user.myCoursesList[index].course.category);
      cats = [...mySet];
      return res.status(200).json(cats);
    });
};
exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
exports.updateProgress = (req, res) => {
  let user = req.profile;
  let progress = req.body.progress;
  if (
    typeof user.myCoursesList[req.myCourseIndex].userProgress === "undefined"
  ) {
    user.myCoursesList[req.myCourseIndex].userProgress = {};
  }
  for (const property in req.body.values) {
    user.myCoursesList[req.myCourseIndex].userProgress.set(
      property,
      req.body.values[property]
    );
  }
  user.myCoursesList[req.myCourseIndex].progress = progress;

  user.save((err, doc) => {
    if (err) return res.status(400).json({ error: err });
    else return res.status(200).json({ message: "Progress added ", user: doc });
  });
};
exports.findInstructor = (req, res, next) => {
  let instructorId = req.course.instructorId.toString();
  console.log(instructorId);
  Instructor.findById(instructorId, (err, doc) => {
    if (err || !doc)
      return res
        .status(400)
        .json({ error: "Instructor of the course not found" });
    req.instructor = doc;
    console.log("Instructor found ");
    next();
  });
};
exports.findCourseInInstructor = (req, res, next) => {
  let myCourse = -1;
  myCourse = req.instructor.coursesByMe.findIndex((obj) => {
    return obj.course.toString() == req.params.myCourseId;
  });
  if (myCourse === -1)
    return res.status(400).json({
      error: "The course isnt present in list of courses by instructor"
    });
  req.instructorCourseIndex = myCourse;
  console.log("Instructor course index found");
  next();
};
exports.postQn = (req, res) => {
  let user = req.profile;
  let course = req.course;
  let instructor = req.instructor;
  let temp = [];
  if (user.myCoursesList[req.myCourseIndex].qns === undefined)
    user.myCoursesList[req.myCourseIndex].qns = {};
  if (
    user.myCoursesList[req.myCourseIndex].qns.get(
      `${req.body.sectionIndex}_${req.body.subSectionIndex}`
    ) !== undefined
  )
    temp = [
      ...user.myCoursesList[req.myCourseIndex].qns.get(
        `${req.body.sectionIndex}_${req.body.subSectionIndex}`
      )
    ];
  console.log(temp);
  temp.push({ qn: req.body.qn });
  let length = temp.length;
  user.myCoursesList[req.myCourseIndex].qns.set(
    `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
    temp
  );

  user.save((err, doc) => {
    if (err) return res.status(400).json({ error: err });
    else {
      let messageText = {
        qn: req.body.qn,
        sectionIndex: req.body.sectionIndex,
        subSectionIndex: req.body.subSectionIndex,
        course: mongoose.Types.ObjectId(course._id),
        type: "doubt",
        user: mongoose.Types.ObjectId(user._id),
        qnIndex: length - 1,
        read: false
      };
      instructor.messages.push(messageText);
      instructor.save((err, doc) => {
        if (err) return res.status(400).json({ error: err });
        return res
          .status(200)
          .json({ message: "Succesfully notified the Instructor" });
      });
    }
  });
};

exports.getProgressOfCourse = (req, res) => {
  let user = req.profile;
  let values = false;
  let initialValues = false;
  if (
    typeof user.myCoursesList[req.myCourseIndex].userProgress !== "undefined" &&
    Object.keys(user.myCoursesList[req.myCourseIndex].userProgress).length > 0
  ) {
    values = user.myCoursesList[req.myCourseIndex].userProgress;
    initialValues = true;
  }
  return res.status(200).json({ values, initialValues });
};

exports.parseFields = (req, res, next) => {
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
      Key: path.basename(`${currentDate}_${fileName}`),
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
        req.body.fileUrl = `https://flamingospaces.sgp1.digitaloceanspaces.com/${currentDate}_${fileName}`;
        console.log("done with parsing");
        next();
      }
    });
  });
};
exports.savewithContent = (req, res) => {
  let user = req.profile;
  if (
    typeof user.myCoursesList[req.myCourseIndex].userProgress === "undefined"
  ) {
    user.myCoursesList[req.myCourseIndex].userProgress = {};
  }
  let tempObj = {
    content: req.body.content,
    done: false
  };
  user.myCoursesList[req.myCourseIndex].userProgress.set(
    `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
    tempObj
  );
  user.save((err, doc) => {
    if (err) return res.status(400).json({ error: err });
    else {
      return res.status(200).json({
        message: "Sucessfully Saved",
        values: user.myCoursesList[req.myCourseIndex].userProgress
      });
    }
  });
};
exports.changePassword = (req, res) => {
  let pwd = req.body.pwd;
  let newpwd = req.body.newpwd;
  let user = req.profile;
  console.log(user);
  if (!user.authenticate(pwd)) {
    return res.status(401).json({ error: "Current password is worng" });
  }
  user.password = newpwd;
  user.save((err, resp) => {
    if (err) return res.status(401).json({ error: errorHandler(err) });
    else
      return res
        .status(200)
        .json({ message: "Your password has been updated sucessfully" });
  });
};
exports.changeProfile = async function (req, res) {
  let user = req.profile;
  user.about = req.body.about;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.username = req.body.username;
  user.save((err, resp) => {
    if (err) return res.status(401).json({ error: errorHandler(err) });
    else
      return res
        .status(200)
        .json({ message: "Your Profile information has been updated" });
  });
};

exports.submitwithContent = (req, res) => {
  let user = req.profile;
  let instructor = req.instructor;
  let course = req.course;
  if (
    typeof user.myCoursesList[req.myCourseIndex].userProgress === "undefined"
  ) {
    user.myCoursesList[req.myCourseIndex].userProgress = {};
  }
  let tempObj = {
    content: req.body.content,
    done: true
  };
  user.myCoursesList[req.myCourseIndex].userProgress.set(
    `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
    tempObj
  );
  console.log(user.myCoursesList[req.myCourseIndex].totalSubmissions);
  user.myCoursesList[req.myCourseIndex].totalSubmissions =
    user.myCoursesList[req.myCourseIndex].totalSubmissions + 1;

  user.save((err, doc) => {
    if (err) return res.status(400).json({ error: err });
    else {
      let temp = [];
      if (
        instructor.coursesByMe[req.instructorCourseIndex].submissions ===
        undefined
      )
        instructor.coursesByMe[req.instructorCourseIndex].submissions = {};

      if (
        instructor.coursesByMe[req.instructorCourseIndex].submissions.get(
          `${req.body.sectionIndex}_${req.body.subSectionIndex}`
        ) !== undefined
      )
        temp = [
          ...instructor.coursesByMe[req.instructorCourseIndex].submissions.get(
            `${req.body.sectionIndex}_${req.body.subSectionIndex}`
          )
        ];
      console.log("Checked Instructor");
      let length = temp.length;
      let submissionObj = {
        sectionIndex: req.body.sectionIndex,
        subSectionIndex: req.body.subSectionIndex,
        course: mongoose.Types.ObjectId(course._id),
        user: mongoose.Types.ObjectId(user._id),
        subIndex: length,
        read: false,
        subContent: req.body.content
      };
      temp.push(submissionObj);
      instructor.coursesByMe[req.instructorCourseIndex].submissions.set(
        `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
        temp
      );
      console.log("i worked");
      instructor.save((err, doc2) => {
        if (err) return res.status(400).json({ error: err });
        console.log(doc.myCoursesList[req.myCourseIndex].userProgress);
        return res.status(200).json({
          message: "Submission was succesfull",
          values: doc.myCoursesList[req.myCourseIndex].userProgress
        });
      });
    }
  });
};
exports.submitWithFile = (req, res) => {
  let user = req.profile;
  let instructor = req.instructor;
  let course = req.course;
  if (
    typeof user.myCoursesList[req.myCourseIndex].userProgress === "undefined"
  ) {
    user.myCoursesList[req.myCourseIndex].userProgress = {};
  }
  let tempObj = {
    fileUrl: req.body.fileUrl,
    done: true
  };
  user.myCoursesList[req.myCourseIndex].userProgress.set(
    `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
    tempObj
  );
  console.log(user.myCoursesList[req.myCourseIndex].totalSubmissions);
  user.myCoursesList[req.myCourseIndex].totalSubmissions =
    user.myCoursesList[req.myCourseIndex].totalSubmissions + 1;
  console.log("Changed user");
  user.save((err, doc) => {
    if (err) return res.status(400).json({ error: err });
    else {
      let temp = [];
      if (
        instructor.coursesByMe[req.instructorCourseIndex].submissions ===
        undefined
      )
        instructor.coursesByMe[req.instructorCourseIndex].submissions = {};

      if (
        instructor.coursesByMe[req.instructorCourseIndex].submissions.get(
          `${req.body.sectionIndex}_${req.body.subSectionIndex}`
        ) !== undefined
      )
        temp = [
          ...instructor.coursesByMe[req.instructorCourseIndex].submissions.get(
            `${req.body.sectionIndex}_${req.body.subSectionIndex}`
          )
        ];
      console.log("Checked Instructor");
      let length = temp.length;
      let submissionObj = {
        sectionIndex: req.body.sectionIndex,
        subSectionIndex: req.body.subSectionIndex,
        course: mongoose.Types.ObjectId(course._id),
        user: mongoose.Types.ObjectId(user._id),
        subIndex: length,
        read: false,
        subFile: req.body.fileUrl
      };
      temp.push(submissionObj);
      instructor.coursesByMe[req.instructorCourseIndex].submissions.set(
        `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
        temp
      );

      instructor.save((err, doc) => {
        if (err) return res.status(400).json({ error: err });
        return res.status(200).json({
          message: "Submission was succesfull",
          values: user.myCoursesList[req.myCourseIndex].userProgress
        });
      });
    }
  });
};
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    req.profile = user;
    next();
  });
};
exports.hashIdUser = function (req, res, next) {
  User.findOne({ hash: req.params.hashId }, (err, doc) => {
    if (err) return res.status(400).json({ error: err });
    if (!doc) return res.status(400).json({ error: "Not a valid route" });
    if (doc) {
      req.user = doc;
      next();
    }
  });
};

exports.myCourseId = (req, res, next, id) => {
  let myCourse = -1;
  myCourse = req.profile.myCoursesList.findIndex((obj) => {
    return obj.course.toString() == req.params.myCourseId;
  });
  if (myCourse === -1)
    return res.status(400).json({
      error: "The course isnt present in this my courses list of the user"
    });
  req.myCourseIndex = myCourse;
  Course.findById(id).exec((err, course) => {
    if (err || !course)
      return res.status(400).json({ error: "Course not found" });
    req.course = course;
    next();
  });
};

exports.enrollInClass = async (req, res) => {
  const Class = await ClassModel.findOne({
    $and: [
      { ofClass: req.body.ofClass },
      { classSection: req.body.classSection }
    ]
  });
  req.body.classId = Class._id;
  const doc = await User.findByIdAndUpdate(req.params.userId, {
    ofClass: req.body.ofClass,
    classSection: req.body.classSection,
    classId: req.body.classId
  });
  res.status(200).json({
    doc
  });
};

exports.findSessions = async (req, res) => {
  const doc = await User.findById(req.params.userId);
  if (!doc) {
    return res.status(400).json({
      status: "Not found",
      message: "Can't find any students"
    });
  }
  res.status(200).json({
    status: "success",
    doc
  });
};
