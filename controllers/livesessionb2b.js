const Liveb2b = require("../models/liveSessionb2b");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { removeParam } = require("../helpers/removeParam");
exports.create = function (req, res) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = req.body.sessionUrl.match(regExp);

  if (match && match[2].length == 11) {
    req.body.liveUrlId = match[2];
  } else {
    return res
      .status(400)
      .json({ error: "Not a valid youtube video please try again" });
  }
  req.body.sessionUrl = removeParam("t", req.body.sessionUrl);

  let lb = new Liveb2b(req.body);
  lb.save((err, doc) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else
      return res
        .status(200)
        .json({ message: "Your live session has been created" });
  });
};
exports.list = function (req, res) {
  Liveb2b.find({
    university: req.params.university,
    department: req.params.department,
    semesters: { $in: [req.params.sem] },
  }).exec((err, response) => {
    console.log(response);
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else return res.status(200).json(response);
  });
};
exports.liveById = function (req, res) {
  Liveb2b.findById(req.params.id, (err, response) => {
    console.log(response);
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else return res.status(200).json(response);
  });
};
