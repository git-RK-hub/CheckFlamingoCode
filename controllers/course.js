const Course = require("../models/course");
const Instructor = require("../models/instructor");
const Admin1 = require("../models/admin1");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
let { s3 } = require("../helpers/aws");

const { errorHandler } = require("../helpers/dbErrorHandler");
const { response } = require("express");
const admin1 = require("../models/admin1");
const { removeParam } = require("../helpers/removeParam");
exports.findInstructor = (req, res, next) => {
  Instructor.findById(req.body.instructorId, (err, instructor) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else {
      req.instructor = instructor;
      next();
    }
  });
};

exports.create = function (req, res) {
  if (req.body.introUrl && req.body.introUrl !== "") {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = req.body.introUrl.match(regExp);

    if (match && match[2].length == 11) {
      req.body.videoId = match[2];
    } else {
      return res
        .status(400)
        .json({ error: "Not a valid youtube video please try again" });
    }
  }
  req.body.introUrl = removeParam("t", req.body.introUrl);
  const course = new Course(req.body);
  course.instructorName =
    req.instructor.firstName + " " + req.instructor.lastName;
  const instructorId = req.body.instructorId;

  if (req.instructor.role === 2) {
    course.b2c = false;
    course.univeristy = req.instructor.univeristy;
  }
  course.save((err, updatedCourse) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    } else
      Instructor.findById(instructorId, (err, instructor) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });
        instructor.coursesByMe.push({ course: updatedCourse });
        instructor.save((err, response) => {
          if (err) return res.status(400).json({ error: errorHandler(err) });
          return res.status(200).json({
            course: updatedCourse,
            message:
              "The course has been intiated. Let's move on to the next step",
          });
        });
      });
  });
};
exports.addToLeaderboard = (req, res) => {};
exports.createAnAdmin1 = (req, res) => {
  let obj;
  Admin1.find().exec((err, data) => {
    // console.log(err);
    if (err) return { error: errorHandler(err) };
    else {
      // console.log(data);
      if (data.length === 0) {
        obj = new Admin1({});
        // console.log(obj);
        obj.save((err, doc) => {
          if (err) return { error: errorHandler(err) };
          else return { message: "Done" };
        });
      }
    }
  });
};
exports.createWithImage = (req, res, next) => {
  let fileName;
  let currentDate = Date.now();
  let form = new formidable.IncomingForm({ multiples: true });
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Something went wrong" });
    let file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file is chosen" });
    }

    fileName = files.file.name;
    fileName.replace(/ /g, "_");

    let filePath = files.file.path;
    var params = {
      Bucket: "flamingospaces",
      Key: path.basename(`${currentDate}_${fileName}`),
      Body: fs.createReadStream(filePath),
      ACL: "public-read",
    };
    s3.upload(params, function (err, data) {
      if (err) {
        return res.status(400).json({ error: "Something went wrong" });
      } else {
        for (const property in fields) {
          if (property === "tags") {
            req.body[property] = fields[property].split(",");
          } else if (property === "prerequisites") {
            req.body[property] = fields[property].split(",");
          } else if (property === "sems") {
            req.body[property] = fields[property].split(",");
          } else req.body[property] = fields[property];
        }
        req.body.imgUrl = `https://flamingospaces.sgp1.digitaloceanspaces.com/${currentDate}_${fileName}`;
        req.body.introUrl = "";
        next();
      }
    });
  });
};
exports.list = function (req, res) {
  Course.find({ approved: true, b2c: true, disabled: false }).exec(
    (err, data) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      console.log(data);
      return res.status(200).json(data);
    }
  );
};
exports.recomendedCourses = function (req, res) {
  Course.find({ approved: true, tags: { $in: req.body.tags } }).exec(
    (err, data) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      console.log(data);
      return res.status(200).json(data);
    }
  );
};
exports.read = function (req, res) {
  return res.json({ course: req.course });
};
exports.updateWithImage = function (req, res, next) {
  let fileName;
  let currentDate = Date.now();
  let form = new formidable.IncomingForm({ multiples: true });
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: err });
    console.log(files);
    let file = files.file;
    if (!file && req.course.imgUrl === undefined) {
      return res.status(400).json({ error: "No file chosen" });
    } else if (!file) {
      console.log("came here");
      for (const property in fields) {
        if (property === "tags") {
          req.body[property] = fields[property].split(",");
        } else if (property === "prerequisites") {
          req.body[property] = fields[property].split(",");
        } else if (property === "sems") {
          req.body[property] = fields[property].split(",");
        } else req.body[property] = fields[property];
      }
      next();
    } else {
      fileName = files.file.name;
      fileName.replace(/ /g, "_");
      let filePath = files.file.path;
      var params = {
        Bucket: "flamingospaces",
        Key: path.basename(`${currentDate}_${fileName}`),
        Body: fs.createReadStream(filePath),
        ACL: "public-read",
      };
      s3.upload(params, function (err, data) {
        if (err) {
          return res.status(400).json({ error: "Something went wrong" });
        } else {
          console.log("I was hit in the update");
          for (const property in fields) {
            if (property === "tags") {
              req.body[property] = fields[property].split(",");
            } else if (property === "prerequisites") {
              req.body[property] = fields[property].split(",");
            } else if (property === "sems") {
              req.body[property] = fields[property].split(",");
            } else req.body[property] = fields[property];
          }
          req.body.imgUrl = `https://flamingospaces.sgp1.digitaloceanspaces.com/${currentDate}_${fileName}`;
          req.body.introUrl = "";

          next();
        }
      });
    }
  });
};
exports.update = function (req, res) {
  let course = req.course;
  const upCourse = req.body;
  // if (course.approved === true) course.dup = upCourse;
  // else course = upCourse;
  course.save((err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: errorHandler(err) });
    } else {
      return res.status(200).json({
        message: "Data updated",
        course: data.approved === true ? data.dup : data,
      });
    }
  });
};
exports.remove = function (req, res) {
  console.log(req.currentUserRole);
  const course = req.course;
  const instructorId = req.course.instructorId;
  const submitted = course.submitted;
  if (req.currentUserRole === "admin") {
    course.disabled = true;
    course.save((err, resp) => {
      if (err)
        return res.status(401).json({
          error: errorHandler(err),
        });
      else {
        return res.status(401).json({
          message:
            "The course will be disabled not deleted since It has users already. But it wont be displayed in the courses list of a user",
        });
      }
    });
  } else {
    if (submitted && course.univeristy === undefined)
      return res.status(401).json({
        error:
          "Once the Course is submitted you cannot delete please contact team flamingo",
      });
    else if (submitted && course.univeristy) {
      course.disabled = true;
      course.save((err, resp) => {
        if (err)
          return res.status(401).json({
            error: errorHandler(err),
          });
        else {
          return res.status(401).json({
            message:
              "The course will be disabled not deleted since It has users already",
          });
        }
      });
    } else if (!submitted) {
      Instructor.findById(instructorId, (err, instructor) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });
        return instructor
          .deleteACourse(course._id)
          .then(
            course.remove((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              } else {
                res.status(200).json({
                  message: "Course deleted",
                });
              }
            })
          )
          .catch((err) => console.log(err));
      });
    }
  }
};
exports.finish = (req, res, next) => {
  const course = req.course;
  req.course.submitted = true;
  course.save((err, course) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ error: "Could not submit the course. Please Try again" });
    } else {
      if (course.univeristy === undefined) {
        (req.message =
          "Course submitted successfully. Team flamingo will review it within 24 hours get back to you"),
          next();
      } else {
        return res.status(200).json({
          message:
            "Your course has been submitted successfully. Your corresponding students can view it",
        });
      }
    }
  });
};
exports.updateCourse = (req, res, next) => {
  const course = req.course;
  req.course.dupActive = true;
  course.save((err, course) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ error: "Could not update the course. Please Try again" });
    } else {
      (req.message =
        "Your update has been submitted successfully. Team flamingo will review it within 24 hours get back to you"),
        next();
    }
  });
};

exports.sendMessageToAdmin1 = (req, res) => {
  Admin1.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    let admin1 = data[0];
    admin1.coursePermissions.push({ course: req.course });
    admin1.save((err, doc) => {
      console.log(doc);
      if (err) return res.status(400).json({ error: errorHandler(err) });
      else return res.status(200).json({ message: req.message });
    });
  });
};
exports.sendMessageToAdmin1ApprovedCourse = (req, res) => {
  Admin1.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    let admin1 = data[0];
    admin1.courseApprovedPermissions.push({ course: req.course });
    admin1.save((err, doc) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      else return res.status(200).json({ message: req.message });
    });
  });
};

exports.courseId = (req, res, next, id) => {
  Course.findById(id).exec((err, course) => {
    if (err || !course)
      return res.status(400).json({ error: "Course not found" });
    req.course = course;
    next();
  });
};
