const mongoose = require('mongoose');
const Wall = require('../models/wall');
const User = require('../models/user');
const Message = require('../models/message');
//Mongoose configuration
mongoose.connect("mongodb://localhost:27017/proyecto-ironhack");

const globalWall = new Wall({
  owner_id: undefined,
  wallType: 'GLOBAL',
  message : []
});

Wall.create(globalWall, (err, wall) => {
  if (err) {
    throw err;
  }
  console.log(wall);

  User.find({},(err,users)=>{
    if(users.length)
    {
      users.forEach((user)=>{
        let tempArray = [];
        for(let i=0; i<3; i++){
          let newMessage = new Message({
            message: user.username +" Message: "+i,
            owner_id: user._id,
            dest_id: undefined,
            messageType: 'GLOBAL'
          });
          tempArray.push(newMessage);
        }

        Message.create(tempArray, (err, messages) => {
          if (err) {
            throw err;
          }
          wall.messages.push(...messages);
          wall.save((err,updatedWall)=>{
            if(err){
              throw err;
            }
            console.log("wall",wall);
          });
          Message.find({messageType:'GLOBAL'}, (err,messages)=>{
            console.log("messages busqueda",messages);
          });
        });
      });
    }
  });
});


//
// Message.find({messageType:'GLOBAL'}, (err,messages)=>{
//   //globalWall.messages.push(...messages);
//   console.log("messages",messages);
//   mongoose.connection.close();
//   // Wall.create(globalWall, (err, wall) => {
//   //   if (err) {
//   //     throw err;
//   //   }
//   //   console.log(wall);
//   //   mongoose.connection.close();
//   // });
// });
