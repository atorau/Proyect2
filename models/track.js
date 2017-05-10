const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackSchema = new Schema({
  name: String,
  file_path: String,
  file_name: String,
  route_id: {
    type: Schema.Types.ObjectId,
    ref: "Route"
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

});

var Track = mongoose.model("Track", trackSchema);
module.exports = Track;
