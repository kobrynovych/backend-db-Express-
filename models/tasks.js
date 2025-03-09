import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    author: { // Add the author field
        type: mongoose.Schema.Types.ObjectId, // ObjectId type
        ref: 'User', // Reference to the User model
        required: true, // Author required
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// // To follow the changes
// const changeStream = Task.watch();

// changeStream.on('change', (change) => {
//   console.log('change Task: ', change);
//   // Your code to handle the change
// });

// export const deleteSchema = async () => {
//     try {
//         // Deleting a collection
//         await Task.collection.drop();
//         console.log('Task collection successfully deleted');
//     } catch (error) {
//         if (error.code === 26) {
//             console.log('The Task collection does not exist.');
//         } else {
//             console.error('Error deleting Task collection: ', error);
//         }
//     }
// };
  
// // Call the function to delete the schema
// deleteSchema();

export const getTasks = async (limit, skip) => {
    return Task.find()
        .populate('author', 'firstName lastName')   // We are pulling up user data.
        .sort({ createdAt: -1 })    // Sorts by creation date (createdAt), starting with the newest
        .limit(limit)  // Choose 10 items
        .skip(skip)    // Skip 0 (for the first page)
};

export const getUserTasks = (userId) => {
    return Task.find({ author: userId })
        .populate('author', 'firstName lastName')   // We are pulling up user data.
        .sort({ createdAt: -1 })    // Sorts by creation date (createdAt), starting with the newest
};

export const addTask = (title, completed, author) => {
    const newTask = new Task({ title, completed: completed || false, author });
    return newTask.save();
};

export const getOneTask = (_id) => {
    return Task.findById(_id);
};

export const editTask = (itemId, body) => {
    return Task.findByIdAndUpdate(itemId, body, { new: true });
};

export const getTotalNumberOfTasks = async (limit, skip) => {
    return await Task.countDocuments();
};

export const removeTask = (itemId) => {
    return Task.findByIdAndDelete(itemId);
};
