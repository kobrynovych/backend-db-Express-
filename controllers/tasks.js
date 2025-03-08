import { getTasks, addTask, editTask, removeTask } from "../models/tasks.js";

export const getAllTasks = async (req, res) => {
    const tasks = await getTasks();

    res.render('tasks', {
        userRole: req.session.role,
        tasks: tasks,
    });
};

export const createTask = async (req, res) => {
    const { title, completed } = req.body;
    const task = await addTask(title, completed);

    res.status(201).json(task);
};

export const getTask = (req, res) => {
    return res.json({});
};

export const updateTask = async (req, res) => {
    const task = await editTask(req.params.id, req.body);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
};

export const deleteTask = async (req, res) => {
    const deletedTask = await removeTask(req.params.id);

    if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
    } 
    
    res.json({ message: 'Task deleted' });
};
