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

    picture: {
      type: Schema.Types.ObjectId,
      ref: "Picture"
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER'
    },

    routes: [{
      type: Schema.Types.ObjectId,
      ref: "Route"
    }],

    albumns: [{
      type: Schema.Types.ObjectId,
      ref: "Albumn"
    }],

    tracks: [{
      type: Schema.Types.ObjectId,
      ref: "Track"
    }],

    // comments: [[type : Schema.Types.ObjectId, ref: "Message"]],

    messages: [{
      type: Schema.Types.ObjectId,
      ref: "Message"
    }],

    conversations: [{
      type: Schema.Types.ObjectId,
      ref: "Conversations"
    }],

    wall: {
      type: Schema.Types.ObjectId,
      ref: "Wall"
    }
  },{
    timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"}
  });

const User = mongoose.model("User", userSchema);
module.exports = User;
