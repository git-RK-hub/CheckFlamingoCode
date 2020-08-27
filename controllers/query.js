const {
  sendEmailQuery,
  sendEmailLiveDemo,
} = require("../helpers/emailHandler");
exports.sendQuery = (req, res) => {
  const response = sendEmailQuery(
    req.body.name,
    req.body.phno,
    req.body.emailId,
    req.body.query
  );
  console.log(response);
  if (response.error)
    return res.status(400).json({ error: "Email could not be sent" });
  else
    return res.status(200).json({
      message: "Thank you for contacting us, our team will reach you soon",
    });
};
exports.liveDemo = (req, res) => {
  const response = sendEmailLiveDemo(
    req.body.name,
    req.body.phno,
    req.body.emailId,
    req.body.organization
  );
  console.log(response);
  if (response.error)
    return res.status(400).json({ error: "Email could not be sent" });
  else
    return res.status(200).json({
      message: "Thank you for contacting us, our team will reach you soon",
    });
};
