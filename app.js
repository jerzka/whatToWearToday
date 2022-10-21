const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { getConnection } = require("./db/db");
const userService = require("./controllers/user.controller");

const app = express();
const port = 3003;

app.engine('handlebars', engine());
app.set('view engine', 'hbs');
app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
    }));   

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client/public')));

app.get('/', (req, res) => {
    res.render('intro', {layout: 'main', customstyle: `<link rel="stylesheet" href="carousel.css">`});
});
app.get('/signup', (req, res) => {
    res.render('signup', {
                    layout: 'main', 
                    customstyle: `<link rel="stylesheet" href="forms.css">`});
});

app.post('/signup', async (req, res) => {
    console.log(req.body);
    try {
        await userService.storeUser(req.body);
    } catch(err) {
        res.status(err.code).json({
            error: err.msg
        })
        return;
    }
    res.status(200).json({
         message: "user created sucessfully"
    });
});

app.get('/signin', (req, res) => {
    res.sendFile(__dirname +'/client/signin.html');
});

app.post('/signin', (req, res) => {
    const userInfo = req.body;
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname +'/client/home.html');
});

app.get('/details', (req, res) => {
    res.sendFile(__dirname +'/client/cloth.html');
});

app.get('/add-cloth', (req, res) => {
    res.sendFile(__dirname +'/client/cloth-form.html');
});

app.get('/logout', (req, res) => {
    loggedIn = false;
    res.redirect('/signin');
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname +'/client/index.html');
// });

app.use((req, res) => {
    res.status(404).sendFile(__dirname +'/client/404.html');
});

app.listen(port, async() => {
    console.log('Listening from port 3003');
    await getConnection();
    console.log("Connected to MongoDB");
});

module.exports = app;