require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");
const mockRoutes = require("./routes/mock");
const instructorRoutes = require("./routes/instructor");
const sectionRoutes = require("./routes/section");
const subSectionRoutes = require("./routes/subSection");
const blogRoutes = require("./routes/blog");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment");
const ccRoutes = require("./routes/corporateConnect");
const liveb2bRoutes = require("./routes/liveb2b");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const expressValidator = require("express-validator");
const cors = require("cors");
const { createAnAdmin1 } = require("./controllers/course");
const { refreshDatabase } = require("./helpers/databaseRefresh");
const app = express();
const { mongoDevURI, mongoProdURI, mongoAtlasURI } = require("./config.json");
let mongoURI = mongoDevURI;
if (process.env.NODE_ENV === "dev") {
  mongoURI = mongoDevURI;
} else if (process.env.NODE_ENV === "production") mongoURI = mongoProdURI;
mongoose
  .connect(mongoAtlasURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(console.log("DB connected"));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(expressValidator());
app.use(flash());

app.use(cors());

// Scheduler which refresh the session in database after every 24 hours to delete the old sessions
// cron.schedule("0 0 * * *", function () {
//   refreshDatabase();
//   console.log("Database refreshed");
// });

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", sectionRoutes);
app.use("/api", subSectionRoutes);
app.use("/api", adminRoutes);
app.use("/api", instructorRoutes);
app.use("/api", blogRoutes);
app.use("/api", cartRoutes);
app.use("/api", paymentRoutes);
app.use("/api", ccRoutes);
app.use("/api", liveb2bRoutes);
app.use("/api", mockRoutes);
app.get("/", function (req, res) {
  res.json("hello");
});
createAnAdmin1();
const port = 8000;

app.listen(port, () => console.log(`Server started on port ${port}`));
