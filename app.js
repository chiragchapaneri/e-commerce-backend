const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const fileupload = require("express-fileupload");
global.config = require("./config");
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(
  fileupload({
    useTempFiles: true,
  })
);
require("dotenv").config();

app.use(cors());
const port = 3000;
const mongoose = require("mongoose");
app.use(express.Router());

const user = require("./controller/user");
const admin = require("./controller/admin");
const bodyParser = require("body-parser");

mongoose
  .connect(process.env.con, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB "));

app.use("/user", user);
app.use("/admin", admin);

app.listen(process.env.port, () => {
  console.log(`app listening  at http://localhost:${process.env.port}`);
});
