const Section = require("../models/section");
const Course = require("../models/course");

const { errorHandler } = require("../helpers/dbErrorHandler");
const course = require("../models/course");
exports.create = function (req, res) {
  const section = new Section(req.body);
  const course = req.course;

  if (course.approved === true) {
    const index = course.dup.sections.findIndex((obj) => {
      return obj.sectionName === section.sectionName;
    });
    if (index != -1)
      return res
        .status(400)
        .json({ error: "This section Name already exists in this course" });
    course.dup.sections.push(section);
  } else {
    const index = course.sections.findIndex((obj) => {
      return obj.sectionName === section.sectionName;
    });
    if (index != -1)
      return res
        .status(400)
        .json({ error: "This section Name already exists in this course" });
    course.sections.push(section);
  }
  course.save((err, course) => {
    if (err || !section) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(200).json({
      message: "A new section has been created",
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
    return res.status(200).json({ sections: data.sections });
  });
};
exports.update = function (req, res) {
  const section = req.body;
  const course = req.course;
  const sectionIndex = req.section.index;
  const oldSection = req.section;

  if (course.approved === true) {
    const index = course.dup.sections.findIndex((obj) => {
      return (
        obj._id !== req.section._id && obj.sectionName === section.sectionName
      );
    });
    if (index !== -1 && index !== sectionIndex)
      return res
        .status(400)
        .json({ error: "This section Name already exists in this course" });
    console.log(course.dup.sections[sectionIndex]);
    course.dup.sections[sectionIndex].sectionName = section.sectionName;
    course.dup.sections[sectionIndex].description = section.description;
  } else {
    const index = course.sections.findIndex((obj) => {
      return (
        obj._id !== req.section._id && obj.sectionName === section.sectionName
      );
    });
    if (index !== -1 && index !== sectionIndex)
      return res
        .status(400)
        .json({ error: "This section Name already exists in this course" });
    course.sections[sectionIndex].sectionName = section.sectionName;
    course.sections[sectionIndex].description = section.description;
  }

  course.save((err, course) => {
    if (err || !course) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(200).json({
      message: "The course and section are updated",
      course: course.approved === true ? course.dup : course,
    });
  });
};
exports.remove = function (req, res) {
  const section = req.section;
  const course = req.course;
  const approved = course.approved;
  if (approved)
    return res.status(401).json({
      error:
        "Once the Course is approved you cannot delete a section please contact team flamingo",
    });

  course.totalSubSections =
    course.totalSubSections - req.section.subSections.length;
  course.sections.splice(req.section.index, 1);
  course.save((err, course) => {
    if (err || !course) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(200).json({
      message: "The course and section are updated",
      course: course,
    });
  });
};
exports.sectionId = (req, res, next, id) => {
  let section = -1;
  if (req.course.approved === true) {
    section = req.course.dup.sections.findIndex((obj) => {
      return obj._id == req.params.sectionId;
    });
    if (section === -1)
      return res
        .status(400)
        .json({ error: "The section isnt present in this course" });
    req.section = req.course.dup.sections[section];
    req.section.index = section;
    next();
  } else {
    section = req.course.sections.findIndex((obj) => {
      return obj._id == req.params.sectionId;
    });
    if (section === -1)
      return res
        .status(400)
        .json({ error: "The section isnt present in this course" });
    req.section = req.course.sections[section];
    req.section.index = section;
    next();
  }
};
exports.read = (req, res) => {
  return res.json({ section: req.section, sectionIndex: req.section.index });
};
