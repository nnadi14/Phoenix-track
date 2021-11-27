const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
   //setting user as object id and reference
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    goal: {
        type: String,
        required: true
    },

    module: {
        type: String,
        required: true
    },

    due: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'In Progress',
        required: true
    },

    milestones: {
        type: String,
        
    },

    completion: {
        type: String
    }
    
})
module.exports = mongoose.model('Project', ProjectSchema);