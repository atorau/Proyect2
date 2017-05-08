const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const albumnSchema = new Schema({
  title: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }],
  pictures: [{
    type: Schema.Types.ObjectId,
    ref: "Picture"
  }],
  route_id: {
    type: Schema.Types.ObjectId,
    ref: "Route"
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},  {timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"}
});

const Albumn = mongoose.model("Albumn", albumnSchema);
module.exports = Albumn;
