const ClassModel = require("../models/classModel");

exports.refreshDatabase = (req, res) => {
  ClassModel.find()
    .then((doc) => {
      let trx = doc;
      trx.forEach((el, i) =>
        el.sessions.forEach((l, index) => {
          if (new Date(l.endDate).getTime() < new Date(Date.now()).getTime()) {
            el.sessions.splice(index, 1);
          }
        })
      );
      doc.forEach((el) => el.save());
    })
    .catch((error) => {
      console.log("Error in refreshing database");
    });
};
