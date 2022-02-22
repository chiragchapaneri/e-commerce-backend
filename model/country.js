const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const Country = mongoose.model(
  "country",
  new mongoose.Schema({
    id: { type: Number },
    state: { type: String },
    city: { type: String },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = { Country };
