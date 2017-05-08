/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wallSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  wallType : {
    type: String,
    enum: ['GLOBAL','USER'],
    default: 'USER'
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }]
});

const Wall = mongoose.model("Wall", wallSchema);
module.exports = Wall;
