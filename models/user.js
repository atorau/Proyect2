/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    name: String,
    lastName: String,
    email: String,
    password: String,
    ubication: String,
    addess: String,
    pic_path: String,
    pic_name: String
  },

  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },

  routes: [{
    type: Schema.Types.ObjectID,
    ref: "Route"
  }],

  albumns: [{
    type: Schema.Types.ObjectID,
    ref: "Albumn"
  }],

  tracks: [{
    type: Schema.Types.ObjectID,
    ref: "Track"
  }],

  // comments: [[type : Schema.Types.ObjectID, ref: "Message"]],

  messages: [{
    type: Schema.Types.ObjectID,
    ref: "Message"
  }],

  conversations: [{
    type: SchemaTypes.ObjectyID,
    ref: "Conversations"
  }],

  wall: {
    type: Schema.Types.ObjectId,
    ref: "Wall"
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  });

const User = mongoose.model("User", userSchema);
module.exports = User;
