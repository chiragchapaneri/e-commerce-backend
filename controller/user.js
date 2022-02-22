const express = require("express");
const jwt = require("jsonwebtoken");

const { verifyusertoken } = require("../middleware/usertokenverifiction");
const { upload } = require("../middleware/upload");

const {
  product,
  productByname,
  productbycategory,
  uproductbyid,
  newall,
  allproduct,
  productfilter,
} = require("../Domain/product.domain");
const {
  addcart,
  Decrease_Quantity,
  showcart,
  showcartbyuserid,
  RemoveCart,
  uorderlist,
} = require("../Domain/cart.domain");
const {
  order,
  newcartorders,

  news,
} = require("../Domain/order.domain");

const {
  signup,
  login,
  profile,
  feedback,
  shiping,
  getstate,
  getuser,
  setstate,
} = require("../Domain/user.domain");
const { usershowcategory } = require("../Domain/category.domain");

const route = express.Router();
//user registration
route.post("/signup", upload, signup);
route.post("/profile", upload, verifyusertoken, profile);
//user login
route.post("/login", login);
route.get("/:id", getuser);
//show all category

route.get("/category/show", usershowcategory);

//show all product
route.get("/product/all", allproduct);

// //show all product by name
route.post("/product/name", productByname);

//show all product by categoryname
route.get("/product/categoryname/:id", productbycategory);

//show all product by id
route.get("/product/:id", uproductbyid);
//add product to cart
route.post("/cart/addcart", verifyusertoken, addcart);
//remove product to cart
route.post("/cart/decreasequantity", verifyusertoken, Decrease_Quantity);
//show cart
route.get("/cart/show", verifyusertoken, showcart);
route.get("/order/show", verifyusertoken, uorderlist);

route.get("/cart/show/:id", verifyusertoken, showcartbyuserid);

route.put("/cart/remove", verifyusertoken, RemoveCart);
route.post("/product/filter", productfilter);

//order
route.post("/order", verifyusertoken, order);
// ?route.post("/order/cart", verifyusertoken, newcartorder);
route.post("/order/carts", verifyusertoken, newcartorders);
// orderlist
// route.get("/orderlist", verifyusertoken, news);

//feedaback
route.post("/feedback", verifyusertoken, feedback);
//shiping
route.get("/shiping", verifyusertoken, shiping);

route.get("/state/list", getstate);
route.post("/state", setstate);

module.exports = route;
