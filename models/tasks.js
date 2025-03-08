import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export const getTasks = (req, res) => {
    return Task.find();
};

export const addTask = async (title, completed) => {
    const newTask = new Task({ title, completed: completed || false });
    return await newTask.save();
};

export const editTask = async (itemId, body) => {
    return await Task.findByIdAndUpdate(itemId, body, { new: true });
};

export const removeTask = async (itemId) => {
    return await Task.findByIdAndDelete(itemId);
};
