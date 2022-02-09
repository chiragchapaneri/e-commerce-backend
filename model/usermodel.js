const { string } = require("joi");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
// mongoose
//   .connect("mongodb://localhost:27017/project", {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log("db is connected"))
//   .catch((err) => console.log(err));

autoIncrement.initialize(mongoose.connection);

const User = mongoose.model(
  "user",
  new mongoose.Schema({
    _id: Number,
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mno: { type: Number, unique: true, required: true },

    city: { type: String, required: false },
    state: { type: String, required: false },

    flate_name: { type: String, required: false },
    nearby: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: [true, "enter unique value"],
    },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    image: { type: String },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "_id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = { User };
