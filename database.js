import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Database connected success')
        }
    })
    .catch(err => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Database error: ' + err)
        }
    });