const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

//Middleware to log the request with timestamp in server.log file
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} - ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log +'\n', (err)=>{
        if(err)
            console.log('unable to write to server.log file');
    });
    next();
});

//Maintainance window page
app.use((req, res, next) => {
    res.render('maintainance.hbs');
});

//Middleware for static pages in public folder
app.use(express.static(__dirname + '/public'));

//handlebar helpers
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('capitalizeText', (text) => text.toUpperCase());

//Request handlers
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to Home page :)',
        currentYear: new Date().getFullYear()
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Something went wrong, Try again'
    });
});

//Getting server on desired port
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
