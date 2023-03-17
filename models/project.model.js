const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  // Project's name
  name: {
    type: String,
    required: true,
  },
  // Project's description.
  description: {
    type: String,
    required: true,
  },
  // Storing the number of like by the users.
  likes: {
    type: Number,
  },
  // List of users who follow the project.
    followedBy: {
      followersNumber: {type: Number},
      followersNames: {type: Array},
  }
})