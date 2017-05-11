const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: [true, "Message can't be empty"]
  },
  owner_username: String,
  owner_id: {
  type: Schema.Types.ObjectId,
  ref: "User"
  },
  dest_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  routeOwner_id: {
    type: Schema.Types.ObjectId,
    ref: "Route"
  },
  route_id: {
    type: Schema.Types.ObjectId,
    ref: "Route"
  },
  wall_id: {
    type: Schema.Types.ObjectId,
    ref: "Wall"
  },
  conversation_id: {
    type: Schema.Types.ObjectId,
    ref: "Conversation"
  },
  messageType: {
    type: String,
    enum: ['GLOBAL', 'WALL','CONVERSATION','ROUTE','ROUTE_GLOBAL'],
    default: 'GLOBAL'
  }
},{timestamps: {
  createdAt: "created_at",
  updatedAt: "updated_at"}
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
