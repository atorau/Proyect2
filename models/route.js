/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  name: String,
  ubication: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  albumn : { type: Schema.Types.ObjectId, ref: "Albumn" },
  date: Date,
  track : { type: Schema.Types.ObjectId, ref: "Track" }
});

const Route = mongoose.model("Route", routeSchema);
module.exports = Route;
