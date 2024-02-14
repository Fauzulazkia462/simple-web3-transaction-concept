const express = require('express');
const app = express();
const routes = require('./routes/routes');
const path = require('path');


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});