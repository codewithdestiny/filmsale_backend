import mongoose, { mongo } from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: [true, 'email address is required'],
        validate: {
            validator: (val) => {
                if(!validator.isEmail(val)) return false;
                return true;
            },
            message: "please enter a valid email address"
        }
    },

    dateOfBirth: String,
    
    fullName: String,

    password: {
        select: false,
        type: String,
        required: true,
    },

    token: String,
    expiry: Date,
    status: {
        type: Boolean,
        default: true
    },
    address: {
        type:String
    },
    dateOfbirth: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    purchased_films: [{type: mongoose.Types.ObjectId, 'ref': 'films'}]

}, {timestamps: true});


userSchema.pre("save", async function(next) {
    try {
        if(this.password) {
            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
            next();
        }
    } catch (error) {
        next(error);
    }
});


userSchema.methods.signJwt = function(){
    const payload = {
        id: this._id
    };

    const accessToken = jwt.sign(payload, process.env.ACCESSTOKEN_SECRET, {expiresIn: process.env.ACCESS_EXPIRATION});
    const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET, {expiresIn: process.env.REFRESH_EXPIRATION});

    return {accessToken, refreshToken};
}

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password?? " ", this.password);
}

export const User = mongoose.model("user", userSchema);