const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// mongoose
//   .connect("mongodb://localhost:27017/project", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("db is connected"))
//   .catch((err) => console.log(err));
autoIncrement.initialize(mongoose.connection);

const Cart = mongoose.model(
  "cart",
  mongoose
    .Schema({
      id: { type: Number },
      productid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product",
      },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
      },
      quantity: {
        type: Number,
      },
      total: {
        type: Number,
      },
    })
    .plugin(autoIncrement.plugin, {
      model: "post",
      field: "id",
      startAt: 1,
      incrementBy: 1,
    })
);

module.exports = Cart;
