const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  category: {
    type: String,
    enum: ['SPORT','POLITIC','TECH','SOCIAL']
  },
  active: {
    type: Boolean
  },
},{
  timestamps: true,
});

mongoose.model('Post', PostSchema);