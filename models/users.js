import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required.'],
        trim: true,
        maxlength: 50,
        minlength: [3, 'First Name must contain at least 3 characters.'],
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required.'],
        trim: true,
        maxlength: 50,
        minlength: [3, 'Last Name must contain at least 3 characters.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format.'],
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must contain at least 6 characters.'],
        select: false, // Do not send password when receiving user
    },
    role: {
        type: String,
        enum: ['limited_user', 'user', 'admin'],
        default: 'limited_user',
    },
    dateOfBirth: {
        type: Date,
    },
    profilePicture: {
        type: String, // Profile image URL
    },
}, { timestamps: true });

// // Hashing the password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// Method for password verification
userSchema.methods.comparePassword = async function (candidatePassword) {   // work only with .select('+password')
    // return bcrypt.compare(candidatePassword, this.password);
    return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export const getUsers = () => {
    return User.find();
}

export const createNewUser = (newUser) => {
    return User.create(newUser);
}

export const getUserByEmail = (email) => {
    return User.findOne({ email });
}

export const getUserAndPasswordByEmail = (email) => {
    return User.findOne({ email }).select('+password');
};

export const getOneUser = (_id) => {
    return User.findById(_id);
};

export const editUser = (itemId, body) => {
    return User.findByIdAndUpdate(itemId, body, { new: true });
};

export const removeUser = (itemId) => {
    return User.findByIdAndDelete(itemId);
};
