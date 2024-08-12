import mongoose from 'mongoose';


var filmSchema = new mongoose.Schema({

    //film
    name: {
        type: String,
        required: [true, 'film name is required']
    },

    customers_purchased: [mongoose.Types.ObjectId],

    is_active: {
    type: Boolean,
    default: true,
    },

    amount: {
        type: String,
    },

    narration: String,

    uploader: mongoose.Types.ObjectId,

    movie: [{
        name: String,
        description: String,
        createdAt: Date,
        updatedAt: Date,
        url: String,
    }]

}, {timestamps: true,})

filmSchema.pre("save", async function(next) {
    this.customers_purchased = [];
    next();
})


export const Film = mongoose.model("film", filmSchema);