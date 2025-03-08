import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export const getTasks = () => {
    return Task.find();
};

export const addTask = (title, completed) => {
    const newTask = new Task({ title, completed: completed || false });
    return newTask.save();
};

export const getOneTask = (_id) => {
    return Task.findById(_id);
};

export const editTask = (itemId, body) => {
    return Task.findByIdAndUpdate(itemId, body, { new: true });
};

export const removeTask = (itemId) => {
    return Task.findByIdAndDelete(itemId);
};
