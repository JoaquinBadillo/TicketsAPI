const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    min: 6,
    max: 128,
  },

  description: {
    type: String,
    trim: true,
    required: true,
    min: 6,
    max: 1024,
  },

  folio: {
    type: String,
    trim: true,
    max: 32,
  },

  status: {
    type: String,
    trim: true,
    required: true,
    max: 16,
  },

  priority: {
    type: String,
    trim: true,
    required: true,
    max: 8,
  },

  category: {
    type: String,
    trim: true,
    required: true,
    max: 64,
  },

  incident: {
    type: String,
    trim: true,
    required: true,
    max: 64,
  },

  location: {
    type: String,
    trim: true,
    required: true,
    max: 64,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
    required: true,
  },

  last_update: {
    type: Date,
    default: Date.now,
    required: true,
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
