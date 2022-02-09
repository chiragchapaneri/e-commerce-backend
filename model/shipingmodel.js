const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// mongoose
//   .connect("mongodb://localhost:27017/project", {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log("db is connected"))
//   .catch((err) => console.log(err));
autoIncrement.initialize(mongoose.connection);

const Shiping = mongoose.model(
  "shiping",
  new mongoose.Schema({
    _id: Number,
    userid: {
      type: Number,
      required: true,
      ref: "user",
    },
    productid: {
      type: Number,
      required: true,
      ref: "product",
    },
    quantity: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
    },
    city: {
      type: String,
    },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "_id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = Shiping;
