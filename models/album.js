const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const albumSchema = new Schema({
      title: String,
      pictures: [{
        type: SchemaTypes.ObjectyID,
        ref: "Picture"
      }],
      route_id: {
        type: Schema.Types.ObjectID,
        ref: "Route"
      },
      owner_id: {
        type: Schema.Types.ObjectID,
        ref: "User"
      },
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }

      });

    var Album = mongoose.model("Album", albumSchema); module.exports = Album;
