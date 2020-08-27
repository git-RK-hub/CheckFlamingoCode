const CorporateConnect = require("../models/corporateConnect");
const { removeParam } = require("../helpers/removeParam");
exports.create = function (req, res) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = req.body.youtubeURL.match(regExp);

  if (match && match[2].length == 11) {
    req.body.videoId = match[2];
    req.body.youtubeURL = removeParam("t", req.body.youtubeURL);

    const connect = new CorporateConnect(req.body);
    connect.save((err, connect) => {
      if (err) return res.status(400).json({ error: err });
      else
        return res
          .status(200)
          .json({ message: "Succesfully created a new connect" });
    });
  } else {
    return res.status(400).json({ message: "Unable to extract the video" });
  }
};
exports.list = function (req, res) {
  CorporateConnect.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    res.json(data);
  });
};
exports.listAccToCategory = async function (req, res) {
  let data = [];
  let cats = req.category;
  for (let index = 0; index < cats.size(); i++) {
    let catName = cats[index].category;
    await CorporateConnect.find({ category: cats[index].category }).exec(
      (err, response) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });
        data[catName] = response;
      }
    );
  }
  return res.status(200).json(data);
};
