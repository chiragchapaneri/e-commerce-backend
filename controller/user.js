const express = require("express");
const jwt = require("jsonwebtoken");

const { verifyusertoken } = require("../middleware/usertokenverifiction");
const { upload } = require("../middleware/upload");

const {
  product,
  productByname,
  productbycategory,
  uproductbyid,
} = require("../Domain/product.domain");
const {
  addcart,
  Decrease_Quantity,
  showcart,
  showcartbyuserid,
} = require("../Domain/cart.domain");
const { order, newcartorders, uorderlist } = require("../Domain/order.domain");

const {
  signup,
  login,

  feedback,
  shiping,
} = require("../Domain/user.domain");
const { usershowcategory } = require("../Domain/category.domain");
const { uploadimage } = require("../middleware/imageupload");

const route = express.Router();
//user registration
route.post("/signup", upload, signup);
//user login
route.post("/login", login);
//show all category

route.get("/category/show", usershowcategory);

//show all product
route.get("/product", product);

// //show all product by name
route.post("/product/name", productByname);

//show all product by categoryname
route.get("/product/categoryname", productbycategory);

//show all product by id
route.get("/product/:id", uproductbyid);
//add product to cart
route.post("/cart/addcart", verifyusertoken, addcart);
//remove product to cart
route.post("/cart/decreasequantity", verifyusertoken, Decrease_Quantity);
//show cart
route.get("/cart/show", verifyusertoken, showcart);

route.get("/cart/show/:id", verifyusertoken, showcartbyuserid);

//order
route.post("/order", verifyusertoken, order);
// ?route.post("/order/cart", verifyusertoken, newcartorder);
route.post("/order/carts", verifyusertoken, newcartorders);
// orderlist
route.get("/orderlist", verifyusertoken, uorderlist);

//feedaback
route.post("/feedback", verifyusertoken, feedback);
//shiping
route.get("/shiping", verifyusertoken, shiping);

module.exports = route;
