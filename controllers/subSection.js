const Course = require("../models/course");
const Lecture = require("../models/SubSectionTypes/lecture");
const Quiz = require("../models/SubSectionTypes/quiz");
const Assignment = require("../models/SubSectionTypes/assignment");
const CodingExercise = require("../models/SubSectionTypes/codingExercise");
const PracticeTest = require("../models/SubSectionTypes/practiceTest");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { upload } = require("../helpers/multer");
let { s3 } = require("../helpers/aws");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { removeParam } = require("../helpers/removeParam");

exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ success: false, error: "Only images and GIFs are allowed" });
    } else {
      return res.status(200).json({
        fileName: res.req.file.key,
        success: true,
      });
    }
  });
};
function giveSubSection(type, clone, req) {
  let subSection;
  let error = null;
  if (type === "lecture") {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = clone.youtubeURL.match(regExp);

    if (match && match[2].length == 11) {
      clone.videoId = match[2];
    } else {
      error = "Not able to extract videoId";
    }
    let checkCourse;
    checkCourse = req.course.approved === true ? req.course.dup : req.course;
    checkCourse.sections.forEach((section) => {
      const index = section.subSections.findIndex((obj) => {
        return obj.subType === type && obj.youtubeURL === clone.youtubeURL;
      });
      if (index !== -1) error = "A same video has been uploaded";
      const index2 = section.subSections.findIndex((obj) => {
        return obj.subType === type && obj.lectureName === clone.lectureName;
      });
      if (index2 !== -1) error = "Lecture Name already used";
      const index3 = section.subSections.findIndex((obj) => {
        return obj.subType === type && obj.videoId === clone.videoId;
      });
      if (index3 !== -1) error = "Same video has been already uploaded";
    });
    clone.youtubeURL = removeParam("t", clone.youtubeURL);
    subSection = new Lecture(clone);
  } else if (type === "quiz") {
    subSection = new Quiz(clone);
  } else if (type === "assignment") {
    subSection = new Assignment(clone);
  } else if (type === "codingExercise") subSection = new CodingExercise(clone);
  else if (type === "practiceTest") subSection = new PracticeTest(clone);
  return { error: error, subSection: subSection };
}
function giveSubSectionUpdated(type, req) {
  let subSection;
  let error = null;
  let checkCourse = req.course.approved ? req.course.dup : req.course;
  if (type === "lecture") {
    checkCourse.sections.forEach((section) => {
      const index = section.subSections.findIndex((obj) => {
        return (
          obj.subType === type &&
          obj.youtubeURL === req.body.youtubeURL &&
          req.subSection._id !== obj._id
        );
      });
      if (index !== -1) error = "A same video has been uploaded";
      const index2 = section.subSections.findIndex((obj) => {
        return (
          obj.subType === type &&
          obj.lectureName === req.body.lectureName &&
          req.subSection._id !== obj._id
        );
      });
      if (index2 !== -1) error = "Lecture Name already used";
      const index3 = section.subSections.findIndex((obj) => {
        return (
          obj.subType === type &&
          obj.videoId === req.body.videoId &&
          req.subSection._id !== obj._id
        );
      });
      if (index3 !== -1) error = "Same video has been already uploaded";
    });
  }
  return { error: error, subSection: subSection };
}

function uploadtos3(objFile, currentDate) {
  let fileName = objFile.name;
  fileName.replace(/ /g, "_");
  let filePath = objFile.path;
  var params = {
    Bucket: "flamingospaces",
    Key: path.basename(`${currentDate}_${fileName}`),
    Body: fs.createReadStream(filePath),
    ACL: "public-read",
    ContentType: "application/pdf",
  };
  return s3.upload(params).promise();
}
exports.parseFields = function (req, res, next) {
  console.log("reached here into function");
  let currentDate = Date.now();
  let promises = [];
  let form = new formidable.IncomingForm({});
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    console.log("reached here into Parse");
    if (err) return res.status(400).json({ error: err });

    if (!files.file && !files.ans) {
      return res.status(400).json({ error: "No file chosen" });
    }
    if (files.file) {
      req.body.fileName = `${currentDate}_${files.file.name}`;
      promises.push(uploadtos3(files.file, currentDate));
    }
    if (files.ans) {
      req.body.ansFileName = `${currentDate}_${files.ans.name}`;
      promises.push(uploadtos3(files.ans, currentDate));
    }

    Promise.all(promises).then((response) => {
      console.log("reached here into fields");
      for (const property in fields) {
        req.body[property] = fields[property];
      }
      next();
    });
  });
};
exports.updateParsefields = function (req, res, next) {
  let currentDate = Date.now();
  let promises = [];
  let form = new formidable.IncomingForm({});
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: err });

    if (!files.file && !files.ans) {
      return res.status(400).json({ error: "No file chosen" });
    }

    if (files.file) {
      if (files.file.name !== req.subSection.fileName) {
        req.body.fileName = `${currentDate}_${files.file.name}`;
        promises.push(uploadtos3(files.file, currentDate));
      } else {
        req.body.fileName = req.subSection.fileName;
      }
    } else {
      if (req.subSection.fileName !== undefined) {
        req.body.fileName = req.subSection.fileName;
      }
    }
    if (files.ans) {
      if (files.ans.name !== req.subSection.ansFileName) {
        req.body.ansFileName = `${currentDate}_${files.ans.name}`;
        promises.push(uploadtos3(files.ans, currentDate));
      } else {
        req.body.ansFileName = req.subSection.ansFileName;
      }
    } else {
      if (req.subSection.ansFileName !== undefined) {
        req.body.ansFileName = req.subSection.ansFileName;
      }
    }

    Promise.all(promises).then((response) => {
      for (const property in fields) {
        req.body[property] = fields[property];
      }
      next();
    });
    if (Promise.length === 0) next();
  });
};
exports.create = function (req, res) {
  const type = req.body.type;
  let clone = Object.assign({}, req.body);
  delete clone.type;
  clone.subType = type;
  let course = req.course;
  let error = null;
  let subSection;
  subSection = giveSubSection(type, clone, req);
  console.log(subSection);
  error = subSection.error;
  if (error) return res.status(400).json({ error: error });
  if (course.approved === true) {
    course.dup.sections[req.section.index].subSections.push(
      subSection.subSection
    );
    course.dup.totalSubSections = course.totalSubSections + 1;
  } else {
    course.sections[req.section.index].subSections.push(subSection.subSection);
    course.totalSubSections = course.totalSubSections + 1;
  }

  course.save((err, course) => {
    if (err || !course) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(200).json({
      message: "A new sub section has been created",
      course: course.approved === true ? course.dup : course,
    });
  });
};
exports.list = function (req, res) {
  Course.findById(req.course._id, (err, data) => {
    if (err || !data) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(200).json({ subSections: req.section.subSections });
  });
};
exports.update = function (req, res) {
  let subSection = req.body;
  let originalSub = req.subSection;
  const course = req.course;
  const type = req.body.type;
  let clone = Object.assign({}, subSection);
  clone.subType = type;
  delete clone.type;
  let error = null;
  if (clone.subType === "lecture") {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = subSection.youtubeURL.match(regExp);
    if (match && match[2].length == 11) {
      req.body.videoId = match[2];
    } else {
      return res.status(400).json({
        error:
          "Not able to extract the video Id please check the link provided",
      });
    }
    subSection.youtubeURL = removeParam("t", subSection.youtubeURL);
  }

  let subSectionCheck = giveSubSectionUpdated(type, req);
  error = subSectionCheck.error;
  if (error) return res.status(400).json({ error: error });
  clone._id = originalSub._id;

  if (course.approved)
    course.dup.sections[req.section.index].subSections[
      req.subSection.index
    ] = clone;
  else
    course.sections[req.section.index].subSections[
      req.subSection.index
    ] = clone;
  course.markModified("sections");
  course.save((err, course) => {
    if (err || !course) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(200).json({
      message: "The course and sub section are updated",
      course: course.approved === true ? course.dup : course,
    });
  });
};
exports.remove = function (req, res) {
  const course = req.course;
  const approved = course.approved;
  if (approved)
    return res.status(401).json({
      error:
        "Once the Course is submitted you cannot delete a Sub-Section. Please contact team flamingo",
    });
  course.totalSubSections = course.totalSubSections - 1;

  course.sections[req.section.index].subSections.splice(
    req.subSection.index,
    1
  );
  course.markModified("sections");
  course.save((err, course) => {
    if (err || !course) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(200).json({
      message: "The sub section has been deleted",
      course: course,
    });
  });
};
exports.subSectionId = (req, res, next, id) => {
  let subSection = -1;
  subSection = req.section.subSections.findIndex((obj) => {
    return obj._id == req.params.subSectionId;
  });
  if (subSection === -1)
    return res
      .status(400)
      .json({ error: "The section isnt present in this course" });
  req.subSection = req.section.subSections[subSection];
  req.subSection.index = subSection;
  next();
};
exports.read = (req, res) => {
  return res.json({
    subSection: req.subSection,
    subSectionIndex: req.subSection.index,
  });
};
