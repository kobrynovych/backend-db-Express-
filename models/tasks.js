import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
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
