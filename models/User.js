const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
     type: String,
     trim: true,
     required: true,
     max: 128
    },

   email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    min: 12,
    max: 128
   },

   password: {
    type: String,
    required: true,
    unique: true,
    min: 8,
    max: 64
   },

   role: {
    type: String,
    required: true,
    max: 64
   }
});

module.exports = mongoose.model('User', userSchema);
