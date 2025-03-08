import { getTasks, addTask, getOneTask, editTask, removeTask } from "../models/tasks.js";

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await getTasks();

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.render('tasks', {
                userRole: req.session.role,
                tasks: tasks,
            });
        } else {
            res.json(tasks);
        }
    } catch (error) {
        console.log('err getAllTasks: ', error);

        // return res.status(400).send({
        //     success: false,
        //     error
        // })
    }
};

export const createTask = async (req, res) => {
    const { title, completed } = req.body;
    const task = await addTask(title, completed);

    if (req.headers.accept && req.headers.accept.includes('text/html')) {        
        res.redirect('/tasks');
    } else {
        res.status(201).json(task);
    }
};

export const getTask = async (req, res) => {
    const task = await getOneTask(req.params.id);

    if (req.headers.accept && req.headers.accept.includes('text/html')) {        
        res.render('task-edit', {
            userRole: req.session.role,
            task: task,
        });
    } else {
        res.json(task);
    }
};

export const updateTask = async (req, res) => {
    const task = await editTask(req.params.id, req.body);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (req.headers.accept && req.headers.accept.includes('text/html')) {        
        res.redirect('/tasks');
    } else {
        res.json(task);
    }
};

export const deleteTask = async (req, res) => {
    const deletedTask = await removeTask(req.params.id);

    if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
    } 
    
    if (req.headers.accept && req.headers.accept.includes('text/html')) {        
        res.redirect('/tasks');
    } else {
        res.json({ message: 'Task deleted' });
    }
};
