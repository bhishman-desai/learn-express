const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

/* Custom Middleware */
app.use(logger);


/* Cross Origin Resource Sharing */
app.use(cors(corsOptions));


/* Built-in middlewares */
// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({extended: false}));
// built-in middleware for json
app.use(express.json());
//serve static files
app.use(express.static(path.join(__dirname, '/public')));


/* Routes */
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));


/* 404 */
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({"error": "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
});


/* Error Handling Logic */
app.use(errorHandler);


/* App listen */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));