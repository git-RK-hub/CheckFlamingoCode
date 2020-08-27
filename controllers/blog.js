const Blog = require("../models/blog");
exports.list = function (req, res) {
  Blog.find({ active: true }).exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    res.json(data);
  });
};
exports.read = function (req, res) {
  return res.json({ blog: req.blog });
};
exports.blogId = (req, res, next, id) => {
  Blog.findById(id).exec((err, blog) => {
    if (err || !blog) return res.status(400).json({ error: "Blog not found" });
    req.blog = blog;
    next();
  });
};
