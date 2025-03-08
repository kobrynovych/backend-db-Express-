export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); 

    const statusCode = err.status || 500; 
    const message = err.message || 'Internal server error';

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
        res.status(statusCode).render('error', { message }); // Rendering a page with an error
    } else {
        res.status(statusCode).json({ error: message }); // Sending a JSON error
    }
};
