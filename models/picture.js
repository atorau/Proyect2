const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
  name: String,
  pic_path: String,
  pic_name: String,
  album_id: {
    type: Schema.Types.ObjectId,
    ref: "Album"
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},{timestamps: {
  createdAt: "created_at",
  updatedAt: "updated_at"
}});

const Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;
