const express = require("express");
// const req = require("express/lib/request");
const route = express.Router();
const { verifyadmintoken } = require("../middleware/admintokenverification");
const { adminsignup, adminlogin } = require("../Domain/admin.domain");
const {
  addcategory,
  showcategory,
  deletecategory,
  updatecategory,
} = require("../Domain/category.domain");
const { orderlist } = require("../Domain/order.domain");

const {
  productbyid,
  productadd,
  productdelete,
  allproduct,
  updateproduct,
} = require("../Domain/product.domain");
// const upload = require("../multer");
const { upload } = require("../middleware/upload");
const { uploadimage } = require("../middleware/imageupload");

route.post("/signup", adminsignup);

route.post("/login", adminlogin);
route.post("/category/add", verifyadmintoken, addcategory);
route.get("/category/show", verifyadmintoken, showcategory);
// route.get("/findone", findone);
route.delete("/category/delete/:id", verifyadmintoken, deletecategory);
route.put("/category/update", verifyadmintoken, updatecategory);

//add product
route.post("/product/add", upload, verifyadmintoken, productadd);
//delete product

route.delete("/product/delete/:id", verifyadmintoken, productdelete);

//show all product
route.get("/product", verifyadmintoken, allproduct);

//show  product by id
route.get("/product/:id", verifyadmintoken, productbyid);

route.put("/product/update", uploadimage, verifyadmintoken, updateproduct);
route.get("/orderlist", verifyadmintoken, orderlist);
module.exports = route;
