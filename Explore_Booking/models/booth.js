const mongoose = require('mongoose');
// const { User } = require('./user');

const Comment = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    comment: String,
    score: Number
});

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

const timeSpot = mongoose.Schema({
	time: {
		type: String,
		required: true
	},
	availability: {
		type: Number,
		required: true
	},
	book: [mongoose.Schema.Types.ObjectId],
	waitlist: [mongoose.Schema.Types.ObjectId]
});

const BoothSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
	},
	intro: {
		type: String,
		required: true,
		minlength: 1
	},
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	description: {
		type: String,
		required: true,
		minlength: 1
	},
    img: image,
    comments: [Comment],
    visitors: [mongoose.Schema.Types.ObjectId],
    creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},	
	capacity: {
		type: Number,
		required: true
	},
	timeSlot: [timeSpot]
});


BoothSchema.statics.findByBoothID = function(boothID) {
	const Booth = this
	// First find the booth by boothID
	return Booth.findById(boothID).then((booth) => {
		if (!booth) {
			return Promise.reject()  // not found
		} else {
            return new Promise((resolve, reject) => {
				resolve(booth)
			})
        }
	})
}

const Booth = mongoose.model('Booth', BoothSchema);
module.exports = { Booth };