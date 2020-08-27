const Instructor = require("../models/instructor");
const ClassModel = require("../models/classModel");
const errorHandler = require("../helpers/dbErrorHandler");
const redis = require("redis");
const User = require("../models/user");

const oneday = 60 * 1000 * 24 * 60;
const {
  generateAccessToken,
  generateRefreshToken
} = require("../helpers/tokensHandler");
const client = redis.createClient({});
client.on("connect", function () {
  console.log("connected to redis for instructor");
});
exports.checkInstructor = function (req, res, next) {
  Instructor.findOne({ username: req.body.username }, (err, doc) => {
    if (err) return res.status(400).json({ error: err });
    if (doc)
      return res
        .status(400)
        .json({ error: "Username already used please try other one" });
    Instructor.findOne({ email: req.body.email }, (err, doc) => {
      if (err) return res.status(400).json({ error: err });
      if (doc)
        return res.status(400).json({
          error: "Email already used please try signingnup with a new one"
        });
      if (!doc) next();
    });
  });
};

exports.checkInstructorbyEmail = function (req, res, next) {
  Instructor.findOne({ email: req.body.email }, (err, instructor) => {
    if (err) return res.status(400).json({ error: err });
    if (instructor)
      return res.status(400).json({
        error: "Hey already a user account exists please try another email id"
      });
    if (!instructor) next();
  });
};

exports.signUpInstructor = function (req, res) {
  let instructor = req.instructor;
  if (instructor.email !== req.body.email)
    return res.status(400).json({
      error:
        "Please try to signup using the same mail id previously provided to the team flamingo"
    });
  instructor.email = req.body.email;
  instructor.username = req.body.username;
  instructor.password = req.body.password;
  instructor.firstName = req.body.firstName;
  instructor.lastName = req.body.lastName;
  instructor.active = true;
  instructor.hash = null;
  instructor.save((err, doc) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else return res.status(200).json({ message: "Instructor created" });
  });
};
exports.instructorRead = (req, res) => {
  return res.status(200).json(req.instructor);
};
exports.instructorSignin = function (req, res, next) {
  const { username, password } = req.body;

  Instructor.findOne({ username }, (err, instructor) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    if (!instructor) {
      return next();
    }
    if (!instructor.active) {
      return res.status(400).json({
        error: "Hey not a signed up instructor please check your mail to verify"
      });
    }
    if (!instructor.authenticate(password)) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = generateAccessToken(instructor._id);
    const refreshToken = generateRefreshToken(instructor._id);

    res.cookie("t", token, refreshToken, { expire: new Date() + 9999 });
    const { _id, name, username } = instructor;
    client.get(JSON.stringify(instructor._id), function (err, reply) {
      if (err) {
        return res.status(400).json({ error: err });
      } else if (!reply) {
        //console.log("no login present");
        let refreshTokens = [];
        refreshTokens.push(refreshToken);
        client.setex(
          JSON.stringify(instructor._id),
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
          JSON.stringify(instructor._id),
          3600,
          JSON.stringify(refreshTokensrecieved)
        );
      }
      let role = "instructor";
      return res.status(200).json({
        token,
        refreshToken,
        user: { _id, username, name, role }
      });
    });
  });
};
exports.hashIdInstructor = function (req, res, next) {
  Instructor.findOne({ hash: req.params.hashId }, (err, doc) => {
    if (err) return res.status(400).json({ error: err });
    if (!doc) return res.status(400).json({ error: "Not a valid route" });
    if (doc) {
      req.instructor = doc;
      next();
    }
  });
};
exports.changeProfile = async function (req, res) {
  let instructor = req.instructor;
  instructor.about = req.body.about;
  instructor.firstName = req.body.firstName;
  instructor.lastName = req.body.lastName;
  instructor.username = req.body.username;
  instructor.save((err, resp) => {
    if (err) return res.status(401).json({ error: errorHandler(err) });
    else
      return res
        .status(200)
        .json({ message: "Your Profile information has been updated" });
  });
};
exports.changePassword = (req, res) => {
  let pwd = req.body.pwd;
  let newpwd = req.body.newpwd;
  let instructor = req.instructor;
  if (!instructor.authenticate(pwd)) {
    return res.status(401).json({ error: "Current password is wrong" });
  }
  instructor.password = newpwd;
  instructor.save((err, resp) => {
    if (err) return res.status(401).json({ error: errorHandler(err) });
    else
      return res
        .status(200)
        .json({ message: "Your password has been updated sucessfully" });
  });
};

exports.listCourses = function (req, res) {
  let courses = [];
  Instructor.findById(req.instructor._id)
    .populate("coursesByMe.course")
    .exec((err, instructor) => {
      if (err) return res.status(400).json({ error: err });
      for (let index = 0; index < instructor.coursesByMe.length; index++)
        if (
          instructor.coursesByMe[index].course.disabled !== undefined &&
          instructor.coursesByMe[index].course.disabled === false
        )
          courses.push(instructor.coursesByMe[index].course);
      return res.status(200).json(courses);
    });
};
exports.myMessages = function (req, res) {
  Instructor.findById(req.instructor._id)
    .populate({
      path: "messages.course",
      model: "Course"
    })
    .populate({
      path: "messages.user",
      model: "User"
    })
    .exec((err, instructor) => {
      if (err) return res.status(400).json({ error: err });
      return res.status(200).json({ myMessages: instructor.messages });
    });
};
exports.mySubmissions = function (req, res) {
  let courses = req.instructor.coursesByMe;
  let index = courses.findIndex(
    (element) => element.course == req.params.courseId
  );
  if (index === -1) return res.status(400).json({ error: "Course not found" });
  let mySubmissions = courses[index].submissions;
  if (mySubmissions === undefined)
    return res
      .status(400)
      .json({ error: "No submissions available for this course" });
  var mapIter = mySubmissions.entries();
  let temp = {};
  let tsize = mySubmissions.size;
  if (tsize === 0)
    return res
      .status(400)
      .json({ error: "No submissions available for this course" });
  for (const [key, value] of mapIter) {
    Instructor.findById(req.instructor._id)
      .lean()
      .populate({
        path: `coursesByMe.submissions.${key}.course`,
        model: "Course"
      })
      .populate({
        path: `coursesByMe.submissions.${key}.user`,
        model: "User"
      })
      .exec((err, doc) => {
        let tempobj = {};
        tempobj[key] = doc.coursesByMe[index].submissions[key];
        temp[key] = doc.coursesByMe[index].submissions[key];
        if (Object.keys(temp).length === tsize) {
          return res.status(200).json({ submissions: temp });
        }
      });
  }
};
exports.doNotReply = function (req, res) {
  let index = req.body.index;
  let instructor = req.instructor;
  let getItem = instructor.messages[index];
  console.log(index, typeof index);
  getItem.read = true;

  instructor.messages[index] = getItem;
  instructor.markModified("messages");
  instructor.save((err, ins) => {
    if (err) return res.status(400).json({ error: err });
    return res.status(200).json({ message: "You dont wish to reply" });
  });
};
exports.replyToQn = function (req, res) {
  let index = req.body.index;
  let instructor = req.instructor;
  let user = req.user;
  let getItem = instructor.messages[index];
  getItem.read = true;
  getItem.reply = req.body.reply;
  instructor.markModified("messages");

  instructor.save((err, ins) => {
    if (err) return res.status(400).json({ error: err });
    else {
      console.log(user.myCoursesList[req.myCourseIndex].qns);
      temp = [
        ...user.myCoursesList[req.myCourseIndex].qns.get(
          `${req.body.sectionIndex}_${req.body.subSectionIndex}`
        )
      ];
      temp[req.body.qnIndex].reply = req.body.reply;
    }
    user.myCoursesList[req.myCourseIndex].qns.set(
      `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
      temp
    );
    user.markModified("myCoursesList");
    user.save((err, doc) => {
      if (err) return res.status(400).json({ error: err });
      return res.status(200).json({ message: "Reply sent" });
    });
  });
};
exports.findUser = (req, res, next) => {
  User.findById(req.body.user._id).exec((err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    req.user = user;
    next();
  });
};
exports.myCourseId = (req, res, next) => {
  let myCourse = -1;
  let courseId = req.body.courseId;
  myCourse = req.body.user.myCoursesList.findIndex((obj) => {
    return obj.course.toString() == courseId;
  });
  if (myCourse === -1)
    return res.status(400).json({
      error: "The course isnt present in this my courses list of the user"
    });
  req.myCourseIndex = myCourse;
  next();
};

exports.instructorById = (req, res, next, id) => {
  Instructor.findById(id).exec((err, instructor) => {
    if (err || !instructor)
      return res.status(400).json({ error: "Instructor not found" });
    req.instructor = instructor;
    next();
  });
};
exports.isInstructor = (req, res, next) => {
  let instructor =
    req.instructor &&
    req.auth &&
    Date.now() < req.auth.exp * 1000 &&
    req.instructor._id == req.auth.id;
  if (!instructor) return res.status(403).json({ error: "Access Forbidden " });
  next();
};

exports.allocateMarks = (req, res, next) => {
  let instructor = req.instructor;
  let user = req.user;
  let myCourse = -1;
  console.log(user.myCoursesList);
  myCourse = user.myCoursesList.findIndex((obj) => {
    console.log(obj.course.toString(), req.params.courseId);
    return obj.course.toString() == req.params.courseId;
  });
  if (myCourse === -1)
    return res.status(400).json({
      error: "The course isnt present in this my courses list of the user"
    });
  instructor.save((err, ins) => {
    if (err) return res.status(400).json({ error: err });
    if (user.myCoursesList[myCourse].marks === undefined) {
      user.myCoursesList[myCourse].marks = {};
    }
    let temp = [];
    temp.push({ marks: req.body.marks });
    user.myCoursesList[myCourse].marks.set(
      `${req.body.sectionIndex}_${req.body.subSectionIndex}`,
      temp
    );
    user.save((err, doc) => {
      if (err) return res.status(400).json({ error: err });
      return res.status(200).json({ message: "Marks added" });
    });
  });
};

// find class by class and classSection for which the session should be created
exports.findClass = async (req, res, next) => {
  const doc = await ClassModel.findOne({
    $and: [
      { ofClass: req.body.ofClass },
      { classSection: req.body.classSection }
    ]
  });

  if (!doc) {
    return res.status(400).json({
      status: "Failure",
      message: "Sorry we can't find that class"
    });
  }
  req.class = doc;
  next();
};

// finding session of instructor by instructorId to update or delete ..etc
exports.findSession = async (req, res, next) => {
  const instructor = req.instructor;
  const ofClass = req.class;
  let sessions = ofClass.sessions.filter((el) => {
    return toString(el.instructor) === toString(instructor._id);
  });
  if (sessions.length == 0)
    return res.status(400).json({ message: "Can't find any sessions" });
  req.sessions = sessions;
  next();
};

// Checking existing session
exports.checkSession = async (req, res, next) => {
  // 1) check session availability
  let { title, startDate, endDate } = req.body;
  startDate = new Date(startDate).getTime();
  endDate = new Date(endDate).getTime();
  const session = req.class.sessions.filter((el) => {
    return (
      (new Date(el.startDate).getTime() === startDate &&
        new Date(el.endDate).getTime() === endDate) ||
      (new Date(el.startDate).getTime() >= startDate &&
        new Date(el.endDate).getTime() <= endDate) ||
      (new Date(el.startDate).getTime() >= startDate &&
        new Date(el.endDate).getTime() <= endDate) ||
      (new Date(el.startDate).getTime() <= startDate &&
        new Date(el.endDate).getTime() >= endDate)
    );
  });
  if (session.length != 0) {
    return res.status(400).json({
      status: "fail",
      message:
        "There is already a session booked in between this time Please try selecting another time slot"
    });
  }
  next();
};

// Creating sessions for particular class
exports.createSession = async (req, res) => {
  const instructor = req.instructor;
  if (!instructor) {
    return res
      .status(400)
      .json({ error: "You are not a valid person to create session" });
  }
  const ofClass = req.class;
  if (
    new Date(req.body.endDate).getTime() -
      new Date(req.body.startDate).getTime() <
    10000
  ) {
    return res.status(400).json({
      message: "Session should be atleast 10 minutes long"
    });
  }
  req.body.sessions = {
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    eventURL: `http://167.71.231.78/flamingo-${req.body.title}-${parseInt(
      Math.random() * 100
    )}`,
    instructor: req.instructor._id
  };
  ofClass.sessions.push(req.body.sessions);
  ofClass.save();
  res.status(200).json({
    status: "Success",
    ofClass
  });
};

// Updating particular session of instructor by session id and instructor id
exports.updateSession = async (req, res) => {
  const instructor = req.instructor;
  if (!instructor) {
    return res
      .status(400)
      .json({ error: "You are not a valid person to create session" });
  }
  let sessions = req.sessions;

  session = sessions.filter((el) => el._id == req.body.sessionId);

  if (req.body.title) {
    session[0].title = req.body.title;
    session[0].eventURL = `http://167.71.231.78/flamingo-${
      req.body.title
    }-${parseInt(Math.random() * 100)}`;
  }
  if (req.body.startDate) session[0].startDate = req.body.startDate;
  if (req.body.endDate) session[0].endDate = req.body.endDate;

  await req.class.save();
  res.status(201).json({
    status: "Success",
    class: req.class
  });
};

// Deleting particular session of instructor by sessionid and instructorid
exports.deleteSession = async (req, res) => {
  const instructor = req.instructor;
  if (!instructor) {
    return res
      .status(403)
      .json({ error: "You are not a valid person to create session" });
  }
  const ofClass = req.class;

  ofClass.sessions.pull({ _id: req.body.sessionId });
  req.class.save();
  res.status(200).json({
    status: "success",
    message: "Session Event Deleted"
  });
};

// Fetch class Data which have to shown on calendar
exports.getClass = async (req, res) => {
  const doc = await ClassModel.findOne({
    $and: [
      { ofClass: req.body.ofClass },
      { classSection: req.body.classSection }
    ]
  });

  if (!doc) {
    return res.status(400).json({
      status: "Failure",
      message: "Sorry we can't find that class"
    });
  }
  res.status(200).json({
    status: "success",
    doc
  });
};
