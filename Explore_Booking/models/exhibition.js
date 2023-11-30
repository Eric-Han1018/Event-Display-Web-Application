const mongoose = require('mongoose');
// const { User } = require('./user');

const image = mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

const ExhibitionSchema = new mongoose.Schema({
    admin: mongoose.Schema.Types.ObjectId,

	name: {
		type: String,
		required: true,
		minlength: 1,
	}, 
    brief: {
        type: String,
        required: false
    },
    slogan: {
        type: String,
        required: true,
    },
	description: {
		type: String,
		required: true,
		minlength: 1
	},
    booths: [mongoose.Schema.Types.ObjectId],
    bannerimg: image
});

const Exhibition = mongoose.model('Exhibition', ExhibitionSchema);
module.exports = { Exhibition };