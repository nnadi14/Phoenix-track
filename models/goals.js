const mongoose = require('mongoose');
const GoalSchema = new mongoose.Schema({
   //setting user as object id and reference
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    goal: {
        type: String,
        required: true
    },

   description: {
        type: String,
        required: true
    },

    started: {
        type: Date,
        required: true
    },

   

    
})
module.exports = mongoose.model('Goal', GoalSchema);