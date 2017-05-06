const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
  name: String,
  enum: ['PRODUCT', 'ROUTE'],
  default: 'ROUTE',
  pic_path: String,
  pic_name: String,
  album_id: {
    type: Schema.Types.ObjectID,
    ref: "Album"
  },
  owner_id: {
    type: Schema.Types.ObjectID,
    ref: "User"
  },
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

var Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;
