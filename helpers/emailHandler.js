const nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const User = require("../models/user");
const Instructor = require("../models/instructor");
const Admin = require("../models/admin");
const oneday = 60 * 1000 * 60 * 24;
const { frontendUrl } = require("../config.json");
const { signupTemplate } = require("./htmlTemplates/signupTemplate");
const { verifyEmailTemplate } = require("./htmlTemplates/verifyEmailTemplate");
const {
  resetPasswordTemplate,
} = require("./htmlTemplates/resetPasswordTemplate");
const { resetPasswordInstructor } = require("../controllers/auth");
var options = {
  service: "SendGrid",

  auth: {
    api_key:
      "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",
  },
};

const smtpTransport = nodemailer.createTransport(sgTransport(options));
function sendingmail(mailOptions) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
        reject("Error with the nodemailer");
      } else {
        console.log("Message sent: " + response);
        resolve({ message: "email sent", error: false });
      }
    });
  });
}
function sendEmailAdmin(email, host) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  Admin.findOneAndUpdate(
    { email: email },
    { $set: { hash: hash, createdDate: current_date } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
  console.log(host);
  const link = `${frontendUrl}/admin/verifyAdmin/` + hash;
  console.log(link);
  mailOptions = {
    from: "support@flamingocourses.com",
    to: email,
    subject: "Please click here to signup into flamingo",
    html: signupTemplate(link),
  };
  return sendingmail(mailOptions)
    .then((response) => {
      console.log(response, "from main function");
      return response;
    })
    .catch((error) => {
      console.log(error, "from main fun");
      return error;
    });
}
function sendEmailQuery(name, phno, emailId, query) {
  mailOptions = {
    from: "support@flamingocourses.com",
    to: "support@flamingocourses.com",
    subject: `Query by ${name}`,
    html: `<div>
        ${query}
        ${phno}
        ${emailId}
      </div>`,
  };
  return sendingmail(mailOptions)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return { error: error };
    });
}
function sendEmailLiveDemo(name, phno, emailId, organization) {
  mailOptions = {
    from: "hashmeet.sikka@flamingocourses.com",
    to: "support@flamingocourses.com",
    subject: `Query by ${name}`,
    html: `<div>
        ${name}
        ${phno}
        ${emailId}
        ${organization}
      </div>`,
  };
  return sendingmail(mailOptions)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return { error: error };
    });
}
function sendEmailMockRegistration(name, emailId, content, date, time) {
  mailOptions = {
    from: "hashmeet.sikka@flamingocourses.com",
    to: "support@flamingocourses.com",
    subject: `Registration for mock interview by ${name}`,
    html: `<div>
        ${name}
        ${content}
        ${emailId}
        ${date}
        ${time}
      </div>`,
  };
  return sendingmail(mailOptions)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return { error: error };
    });
}

function sendEmailLiveDemo(name, phno, emailId, organization) {
  mailOptions = {
    from: "hashmeet.sikka@flamingocourses.com",
    to: "support@flamingocourses.com",
    subject: `Query by ${name}`,
    html: `<div>
        ${name}
        ${phno}
        ${emailId}
        ${organization}
      </div>`,
  };
  return sendingmail(mailOptions)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return { error: error };
    });
}
function sendEmailb2bUser(email, host) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  User.findOneAndUpdate(
    { email: email },
    { $set: { hash: hash, createdDate: current_date } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
  console.log(host);
  const link = `${frontendUrl}/verifyUser/` + hash;
  console.log(link);
  mailOptions = {
    from: "support@flamingocourses.com",
    to: email,
    subject: "Please click here to signup into flamingo",
    html: signupTemplate(link),
  };
  return sendingmail(mailOptions)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}
function sendEmailInstructor(email, host) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  Instructor.findOneAndUpdate(
    { email: email },
    { $set: { hash: hash, createdDate: current_date } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      //console.log(doc);
    }
  );
  console.log(host);
  const link = `${frontendUrl}/instructor/verifyInstructor/` + hash;
  console.log(link);
  mailOptions = {
    from: "support@flamingocourses.com",
    to: email,
    subject: "Please click here to signup into flamingo",
    html: signupTemplate(link),
  };
  return sendingmail(mailOptions)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}

function resetEmailAdmin(email) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  return Admin.findOneAndUpdate(
    { email: email },
    { $set: { hash: hash } },
    { new: true },
    (err, doc) => {
      if (err) {
        return { error: "Something went worng" };
      }
      if (!doc) return { error: "Could not find a account" };
      else {
        const link = `${frontendUrl}/verifyReset/` + hash;
        console.log(link);
        mailOptions = {
          from: "support@flamingocourses.com",
          to: email,
          subject: "Reset Password",
          html: resetPasswordTemplate(link),
        };
        sendingmail(mailOptions)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            return error;
          });
      }
    }
  );
}

function resetEmailInstructor(email) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  return Instructor.findOneAndUpdate(
    { email: email },
    { $set: { hash: hash } },
    { new: true },
    (err, doc) => {
      if (err) {
        return { error: "Something went worng" };
      }
      if (!doc) return null;
      else {
        const link = `${frontendUrl}/verifyReset/` + hash;
        console.log(link);
        mailOptions = {
          from: "support@flamingocourses.com",
          to: email,
          subject: "Reset Password",
          html: resetPasswordTemplate(link),
        };
        sendingmail(mailOptions)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            return error;
          });
      }
    }
  );
}

function resetEmail(email) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  return User.findOneAndUpdate(
    { email: email },
    { $set: { hash: hash } },
    { new: true },
    (err, doc) => {
      if (err) {
        return { error: "Something went worng" };
      }
      if (!doc) return null;
      else {
        const link = `${frontendUrl}/verifyReset/` + hash;
        console.log(link);
        mailOptions = {
          from: "support@flamingocourses.com",
          to: email,
          subject: "Reset Password",
          html: resetPasswordTemplate(link),
        };
        sendingmail(mailOptions)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            return error;
          });
      }
    }
  );
}
function sendEmail(email, host) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  User.findOneAndUpdate(
    { email: email },
    { $set: { hash: hash, createdDate: current_date } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      //console.log(doc);
    }
  );
  const link = `${frontendUrl}/verify/` + hash;
  console.log(link);
  mailOptions = {
    from: "support@flamingocourses.com",
    to: email,
    subject: "Please confirm your Email account",
    html: verifyEmailTemplate(link),
  };

  return sendingmail(mailOptions)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}
function verifyResetUser(req, res) {
  User.findOne({ hash: req.params.hashId }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Couldnot identify you" });
    }
    return res.status(200).json({ message: "You have been verified" });
  });
}

function verify(req, res) {
  User.findOne({ hash: req.params.hashId }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Please signup" });
    }

    if (new Date() - user.createdDate > oneday) {
      console.log("date expired");
      const response = sendEmail(user.email, req.get("host"));
      if (response.error)
        return res.status(400).json({ error: "Something wrong with mailer" });
      else
        return res.status(200).json({
          message:
            "The current link has been expired.A new Verification link has been sent to the registered email Id.To continue please verify",
        });
    }
    User.findOneAndUpdate(
      { hash: req.params.hashId },
      { $set: { active: true, hash: null } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }

        //console.log(doc);
      }
    );

    return res.status(200).json({ message: "Successfully verified" });
  });
}
function verifyb2bUser(req, res) {
  User.findOne({ hash: req.params.hashId }, (err, user) => {
    if (err || !instructor) {
      return res.status(400).json({ error: "Please verify the link" });
    }
    if (new Date() - instructor.createdDate > oneday) {
      console.log("date expired");
      const response = sendEmailb2bUser(user.email, req.get("host"));
      if (response.error)
        return res.status(400).json({ error: "Something wrong with mailer" });
      else
        return res.status(200).json({
          message:
            "The current link has been expired.A new Verification link has been sent to the registered email Id.To continue for the signup process please verify",
        });
    }
    return res.status(200).json({ message: "Successfully verified" });
  });
}
function verifyInstructor(req, res) {
  Instructor.findOne({ hash: req.params.hashId }, (err, instructor) => {
    if (err || !instructor) {
      return res.status(400).json({ error: "Please verify the link" });
    }
    if (new Date() - instructor.createdDate > oneday) {
      console.log("date expired");
      const response = sendEmailInstructor(instructor.email, req.get("host"));
      if (response.error)
        return res.status(400).json({ error: "Something wrong with mailer" });
      else
        return res.status(200).json({
          message:
            "The current link has been expired.A new Verification link has been sent to the registered email Id.To continue for the signup process please verify",
        });
    }
    return res.status(200).json({ message: "Successfully verified" });
  });
}
function verifyAdmin(req, res) {
  Admin.findOne({ hash: req.params.hashId }, (err, admin) => {
    if (err || !admin) {
      return res.status(400).json({ error: "Please verify the link" });
    }
    if (new Date() - admin.createdDate > oneday) {
      console.log("date expired");
      const response = sendEmailAdmin(admin.email, req.get("host"));
      if (response.error)
        return res.status(400).json({ error: "Something wrong with mailer" });
      else
        return res.status(200).json({
          message:
            "The current link has been expired.A new Verification link has been sent to the registered email Id.To continue for the signup process please verify",
        });
    }
    return res.status(200).json({ message: "Successfully verified" });
  });
}

module.exports = {
  verify,
  verifyResetUser,
  verifyb2bUser,
  sendEmail,
  sendEmailInstructor,
  sendEmailQuery,
  sendEmailb2bUser,
  verifyInstructor,
  sendEmailAdmin,
  verifyAdmin,
  sendEmailLiveDemo,
  resetEmail,
  sendEmailMockRegistration,
  resetEmailInstructor,
  resetEmailAdmin,
};
