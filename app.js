const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { engine } =require("express-handlebars");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
const port = 3003;

app.engine('handlebars', engine());
app.set('view engine', 'hbs');
app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
    }));   
 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const users = [];
let loggedIn = false;

//console.log('directory-name', __dirname+'/client/index.js');

app.use(express.static(path.join(__dirname, '/client/public')));

app.get('/', (req, res) => {
    res.render('intro', {layout: 'main', customstyle: `<link rel="stylesheet" href="carousel.css">`});
});
app.get('/signup', (req, res) => {
    res.render('signup', {
                    layout: 'main', 
                    customstyle: `<link rel="stylesheet" href="forms.css">`});
});

app.post('/signup', urlencodedParser, (req, res) => {
    const newId = users.length === 0 ? 0 : users[users.length - 1].id + 1;
    const newUser = {
      id: newId,
      user: req.body.userInput,
      email: req.body.emailInput,
      password: req.body.passwordInput
    };
  
    users.push(newUser);
    //res.send(users);
    res.redirect("/signin");
  
  });

app.get('/signin', (req, res) => {
    res.sendFile(__dirname +'/client/signin.html');
});

app.post('/signin', urlencodedParser, (req, res) => {
    const userInfo = req.body;

    if(users.findIndex((x) => (x.user === userInfo.userInput && x.password === userInfo.passwordInput ))){
        loggedIn = true;
        res.redirect("/home");
    }
    else {
        res.send("Acces denied");
    }
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

app.listen(port, () => {
    console.log('Listening from port 3003');
});

module.exports = app;
