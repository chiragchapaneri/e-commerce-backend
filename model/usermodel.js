const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const bcrypt = require("bcrypt");

autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema({
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
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  next();
});

const User = mongoose.model("user", userSchema);

module.exports = { User };
