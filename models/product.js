const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: String,
  picture_id: {
    type: Schema.Types.ObjectID,
    ref: "Picture"
  }
});

var Product = mongoose.model("Product", productSchema);
module.exports = Product;
