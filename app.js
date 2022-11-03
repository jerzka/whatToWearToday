const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { getConnection } = require("./db/db");
const userService = require("./controllers/user.controller");
const cookieParser = require("cookie-parser");
const { auth } = require('./middelwares/auth');
const fileUpload = require('express-fileupload');


const app = express();
const port = 3003;

app.engine('handlebars', engine());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialDir: path.join(__dirname, '/views/partials'),
    extname: 'hbs'
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(cookieParser());
app.use(
    fileUpload({
        limits: {
            fileSize: 1000000,
        },
        abortOnLimit: true
    })
);

app.get('/', (req, res) => {
    res.render('intro', {
        layout: 'main',
        customstyle: `<link rel="stylesheet" href="carousel.css">`,
        customscript: `<script src="index.js"></script>`
    });
});
app.get('/signup', (req, res) => {
    res.render('signup', {
        layout: 'main',
        customstyle: `<link rel="stylesheet" href="forms.css">`
    });
});

app.post('/signup', async (req, res) => {
    console.log(req.body);
    try {
        await userService.storeUser(req.body);
    } catch (err) {
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
    res.render('signin', {
        layout: 'main',
        customstyle: `<link rel="stylesheet" href="forms.css">`
    });
});

app.post('/signin', async (req, res) => {
    const body = req.body;

    if (!body.email || !body.password || body.password.length === 0) {
        res.status(400).json({
            error: "Invalid user information, please check your input"
        });
        return;
    }

    try {
        const { userId, userName, token } = await userService.signin(body);
        if (userId && userName && token) {
            res.cookie('token', token, { maxAge: 900000 });
            res.cookie('userName', userName);
            res.status(200).json({
                userId,
                userName,
                token
            });
        }
    } catch (error) {
        res.status(error.code).json({
            error: error.msg
        })
    }
});

app.get('/home', auth, async (req, res) => {
    try {
        res.render('home', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="carousel.css">`,
            customscript: `<script src="home.js"></script>`,
            helpers: {
                currentDate() {
                        const currentDate = new Date();
                        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        const weekDay = weekDays[currentDate.getDay()];
                        const weekend = (weekDay === "Sunday" || weekDay === "Saturday") ? "Weekend" : "Week day";
                        
                        return `<h5>Today is <b>${weekDay}</b>,
                                 ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.toLocaleString('default', {day:'2-digit'})}, 
                                 ${currentDate.getFullYear()} | <span class="span-bg">${weekend}</span></h5>`

                    }
            },
            name: req.userName
        })
    } catch (error) {
        res.redirect('/login')
        res.end()
        return
    }

});

app.get('/cloth-form', auth, async (req, res) => {
    try {
        res.render('cloth-form', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="auth-forms.css">`,
            customscript: `<script src="add-item.js"></script>`,
            name: req.userName
        })
    } catch (error) {
        res.redirect('/login');
        res.end();
        return;
    }
});

app.post('/add-cloth', auth, (req, res) => {
    console.log(req.body);
    const { image } = req.files;

    console.log(req.body.image);
    if (!image){
         return res.status(400).json({
            error: "Please upload a photo"
        });
    }
    
    if (!/^image/.test(image.mimetype)){
        return res.status(400).json({
            error: "The photo is not a valid image"
        });    
    }
    image.mv(__dirname + '/client/public/upload/' + image.name);

    try{


    } catch (error) {
    res.redirect('/login')
    res.end()
    return
    }
    res.sendStatus(200);
});

app.get('/cloth-details', (req, res) => {
    res.sendFile(__dirname + '/client/cloth.html');
});

app.get('/logout', auth, (req, res) => {
    res.redirect('/signin');
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname +'/client/index.html');
// });

app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/client/404.html');
});

app.listen(port, async () => {
    console.log('Listening from port 3003');
    await getConnection();
    console.log("Connected to MongoDB");
});

module.exports = app;