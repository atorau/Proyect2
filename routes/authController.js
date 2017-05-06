/*jshint esversion: 6*/
// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

const auth = require('../helpers/auth-helpers');


authRoutes.get("/login", (req, res, next) => {
  res.render("intranet/auth/login", {
    "message": req.flash("error")
  });
});
//
// authRoutes.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));
//
// authRoutes.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/login");
// });
//
// authRoutes.get('/:userId/show', auth.ensureLoggedIn('/'), (req, res) => {
//   const userId = req.params.userId;
//   User.findOne({
//     _id: userId
//   }, (err, user) => {
//     res.render("intranet/users/show", {
//       user
//     });
//   });
// });
//
// authRoutes.get('/:userId/edit', auth.ensureLoggedIn('/'), (req, res) => {
//   const userId = req.params.userId;
//
//   if (userId == req.user.id || req.user.role === 'ADMIN') {
//     User.findOne({
//       _id: userId
//     }, (err, user) => {
//       res.render("intranet/users/edit", {
//         user
//       });
//     });
//   } else {
//     return res.redirect('/user-list');
//   }
// });
//
//
// authRoutes.post('/:userId/edit', auth.ensureLoggedIn('/'), (req, res) => {
//
//   if (req.params.userId == req.user.id || req.user.role === 'ADMIN') {
//     const userId = req.params.userId;
//
//     const name = req.body.name;
//     const username = req.body.username;
//     const familyName = req.body.familyName;
//     const password = req.body.password;
//     const role = req.body.role;
//
//     if (username === "" || password === "" || role === "") {
//       User.findOne({
//         _id: userId
//       }, (err, user) => {
//         console.log("hi4");
//         res.render("intranet/users/edit", {
//           user,
//           message: "Indicate username, password and role"
//         });
//       });
//       return;
//     }
//
//     var salt = bcrypt.genSaltSync(bcryptSalt);
//     var hashPass = bcrypt.hashSync(password, salt);
//
//     const editUser = {
//       name,
//       username,
//       familyName,
//       password: hashPass,
//       role,
//       _id: req.params.userId
//     };
//
//     User.findByIdAndUpdate(userId, editUser, (err) => {
//       if (err) {
//         next(err);
//       } else {
//         return res.redirect('/user-list');
//       }
//     });
//   } else {
//     return res.redirect('/user-list');
//   }
// });
//
//
// authRoutes.get('/user-list', auth.ensureLoggedIn('/'), (req, res) => {
//   User.find((err, users) => {
//     console.log("users", users);
//     res.render("intranet/users/user-list", {
//       users
//     });
//   });
// });
//
// authRoutes.get('/:userId/delete', auth.checkRoles('ADMIN'), (req, res) => {
//   const id = req.params.userId;
//   User.deleteOne({
//     _id: id
//   }, (err) => {
//     if (err) {
//       next(error);
//     }
//     res.redirect('/user-list');
//   });
// });
//
// authRoutes.get('/create-user', auth.checkRoles('ADMIN'), (req, res) => {
//   res.render("intranet/auth/create-user");
// });
//
// authRoutes.post('/create-user', auth.checkRoles('ADMIN'), (req, res) => {
//   const name = req.body.name;
//   const username = req.body.username;
//   const familyName = req.body.famlyName;
//   const password = req.body.password;
//   const role = req.body.role;
//
//   if (username === "" || password === "" || role === "") {
//     res.render("intranet/auth/create-user", {
//       message: "Indicate username, password and role"
//     });
//     return;
//   }
//
//   User.findOne({
//     username
//   }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("intranet/auth/create-user", {
//         message: "The username already exists"
//       });
//       return;
//     }
//
//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);
//
//     const newUser = User({
//       name: name,
//       username: username,
//       password: hashPass,
//       familyName: familyName,
//       role: role
//     });
//
//     newUser.save((err) => {
//       if (err) {
//         res.render("intranet/auth/create-user", {
//           message: "Something went wrong"
//         });
//       } else {
//         res.render("intranet/auth/create-user", {
//           message: "User Created"
//         });
//       }
//     });
//   });
// });
//

//
// authRoutes.get("/private-page", ensureLogin.ensureLoggedIn('/'), (req, res) => {
//   res.render("private", { user: req.user });
// });
//
// authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
// authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
//   successRedirect: "/private-page",
//   failureRedirect: "/"
// }));
//
// authRoutes.get("/auth/google", passport.authenticate("google", {
//   scope: ["https://www.googleapis.com/auth/plus.login",
//           "https://www.googleapis.com/auth/plus.profile.emails.read"]
// }));
//
// authRoutes.get("/auth/google/callback", passport.authenticate("google", {
//   failureRedirect: "/",
//   successRedirect: "/private-page"
// }));

module.exports = authRoutes;
