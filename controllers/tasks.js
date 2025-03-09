import { getTasks, addTask, getOneTask, editTask, removeTask, getUserTasks } from "../models/tasks.js";
import { CustomError } from "../errors/CustomError.js";
import { verifyAuthToken } from "../services/auth.js";

export const getAllTasks = async (req, res, next) => {
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
        next(error); 
    }
};

export const createTask = async (req, res, next) => {
    try {
        const { title, completed } = req.body;
        const token = req.session.token;

        if (!token) {
            return res.status(401).json({ message: 'Token not found, please log in' });
        }

        const decoded = verifyAuthToken(token); // Decrypting the token
        const author = decoded._id;
        const task = await addTask(title, completed, author);

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.redirect('/tasks');
        } else {
            res.status(201).json(task);
        }
    } catch (error) {
        next(error); 
    }
};

export const getMyTask = async (req, res, next) => {
    try {
        const token = req.session.token;

        if (!token) {
            return res.status(401).json({ message: 'Token not found, please log in' });
        }

        const decoded = verifyAuthToken(token); // Decrypting the token
        const authorId = decoded._id;
        const tasks = await getUserTasks(authorId);

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.render('tasks-me', {
                userRole: req.session.role,
                tasks: tasks,
            });
        } else {
            res.json(tasks);
        }
    } catch (error) {
        next(error); 
    }
};

export const getTask = async (req, res, next) => {
    try {
        const task = await getOneTask(req.params.id);

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.render('task-edit', {
                userRole: req.session.role,
                task: task,
            });
        } else {
            res.json(task);
        }
    } catch (error) {
        next(error); 
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await editTask(req.params.id, req.body);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.redirect('/tasks');
        } else {
            res.json(task);
        }
    } catch (error) {
        next(error); 
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await removeTask(req.params.id);

        if (!deletedTask) {
            // throw new CustomError('Task not found', 404);
            return res.status(404).json({ error: 'Task not found' });
        } 
        
        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.redirect('/tasks');
        } else {
            res.json({ message: 'Task deleted' });
        }
    } catch (error) {
        next(error); 
    }
};
