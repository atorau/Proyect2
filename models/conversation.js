const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  dest_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
