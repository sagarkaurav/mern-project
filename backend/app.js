const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const places = require('./routes/places');
const users = require('./routes/users');


const app =  express();
app.disable('etag');
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');

    next();
});
app.use('/api/v1/places', places);
app.use('/api/v1/users', users);
app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);        
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occured!'});
});
mongoose.connect('mongodb+srv://sagar:yolo313@cluster0.k8hae.mongodb.net/location_finder?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(5000);
}).catch((error) => console.log(error));