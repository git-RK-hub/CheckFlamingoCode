const Mock = require("../models/mock");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { sendEmailMockRegistration } = require("../helpers/emailHandler");
const { handleErrorNext } = require("./auth");
const { use } = require("../routes/mock");
exports.create = (req, res) => {
  let mock = new Mock(req.body);
  mock.availableSlots = req.body.slots;
  mock.save((err, resp) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else return res.status(200).json({ message: "Mock Interview slot added" });
  });
};
exports.list = (req, res) => {
  Mock.find({
    interviewDate: { $gt: new Date() },
    availableSlots: { $gt: 0 },
  }).exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    else {
      let total = {};
      data.forEach((element) => {
        let date =
          element.interviewDate.getDate() +
          "/" +
          (Number(element.interviewDate.getMonth()) + 1).toString() +
          "/" +
          element.interviewDate.getFullYear();
        if (total[date] !== undefined)
          total[date].push({
            id: element._id,
            from: element.from,
            to: element.to,
            slots: element.availableSlots,
          });
        else {
          total[date] = [];
          total[date].push({
            id: element._id,
            from: element.from,
            to: element.to,
            slots: element.availableSlots,
          });
        }
      });
      console.log(total);
      return res.status(200).json(total);
    }
  });
};
exports.register = async (req, res) => {
  let user = req.profile;
  user.myMockSlots.push(req.body);
  const response = sendEmailMockRegistration(
    req.body.name,
    req.body.emailId,
    req.body.content,
    req.body.date,
    req.body.time
  );
  console.log(response);
  if (response.error)
    return res.status(400).json({ error: "Email could not be sent" });
  else {
    try {
      await user.save();
      let mock = await Mock.find(req.body.mockSlotId);
      if (!resp) return res.status(400).json({ error: "Something went wrong" });
      mock.availableSlots = mock.availableSlots - 1;
      await mock.save();
      return res
        .status(200)
        .json({ message: "You have been registered successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
};
