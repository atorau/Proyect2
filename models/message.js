const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: [true, "Message can't be empty"]
  },
  owner_id: {
  type: Schema.Types.ObjectId,
  ref: "User"
  },
  dest_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  messageType: {
    type: String,
    enum: ['GLOBAL', 'WALL','CONVERSATION','ROUTE'],
    default: 'GLOBAL'
  }
},{timestamps: {
  createdAt: "created_at",
  updatedAt: "updated_at"}
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
