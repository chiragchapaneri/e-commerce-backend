const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const Admin = mongoose.model(
  "admin",
  new mongoose.Schema({
    // _id: { type: String },
    // id: { type: Number },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mno: {
      type: Number,

      required: [true],
      validate: {
        validator: function (num) {
          const data = num.toString().length;
          if (data < 10) {
            return;
          }
        },
        message: "You must provide 10 digit number.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: [true, "enter unique value"],
    },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = { Admin };
