const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: String,
  pic_path: String,
  pic_name: String,
});

var Product = mongoose.model("Product", productSchema);
module.exports = Product;
