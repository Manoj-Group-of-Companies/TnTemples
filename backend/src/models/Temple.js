const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    deity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deity",
        required: true
    },

    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
        required: true
    },

    history: {
        type: String
    },

    description: {
        type: String
    },

    timings: {
        morning: String,
        evening: String,
        specialNotes: String
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },

        address: String
    },

    images: [
        {
            type: String
        }
    ],

    festivals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Festival"
        }
    ],

    contributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    approvedAt: {
        type: Date
    },

    rejectedReason: {
        type: String
    },

    views: {
        type: Number,
        default: 0
    }

},
{ timestamps: true }
);

// Geo index for location search
templeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Temple", templeSchema);