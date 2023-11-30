const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://eric:1018@cluster0.onlqr.mongodb.net/BoothAPI?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

module.exports = { mongoose };