/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({

  products : [
    {type: Schema.Types.ObjectId, ref: "Product"}],
  totalPrice : Number,
  name: String,
  lastName: String,
  email: String,
  address: String,
  text: String,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
