const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { getConnection } = require("./db/db");
const userService = require("./controllers/user.controller");
const cookieParser = require("cookie-parser");
const { auth } = require('./middelwares/auth');
const fileUpload = require('express-fileupload');
const clothService = require("./controllers/cloth.controller");


const app = express();
const port = process.env.PORT;

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
        message: "user created sucessfully",
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
                                 ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.toLocaleString('default', { day: '2-digit' })}, 
                                 ${currentDate.getFullYear()} | <span class="span-bg">${weekend}</span></h5>`

                }
            },
            name: req.userName
        })
    } catch (error) {
        res.redirect('/signin')
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
        res.redirect('/signin');
        res.end();
        return;
    }
});

app.post('/add-cloth', auth, async (req, res) => {
    const data = req.body;
    const { image } = req.files;

    if (!image) {
        return res.status(400).json({
            error: "Please upload a photo"
        });
    }

    if (!/^image/.test(image.mimetype)) {
        return res.status(400).json({
            error: "The photo is not a valid image"
        });
    }

    if (!req.userId || req.userId === 0) {
        return res.status(401).json({
            error: "User not found"
        });
    }

    try {
        let tempraryImageDirectory = '';
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
            tempraryImageDirectory = __dirname + '/client/public/upload/'; //path.join(__dirname, `../../tmp/`);
        } else {
            tempraryImageDirectory = '/tmp/';
        }
        
        image.mv(tempraryImageDirectory + image.name);
        const clothData = {
            user: req.userId,
            name: data.name,
            availability: data.availability,
            seasons: JSON.parse(data.seasons),
            styles: JSON.parse(data.styles),
            colors: JSON.parse(data.colors),
            fabrics: JSON.parse(data.fabrics),
            photo: tempraryImageDirectory + image.name
        }
        const newCloth = await clothService.storeCloth(clothData);
        if (!newCloth) {
            return res.status(400).json({
                error: "Unsuccessful create new cloth"
            });
        }

        const updatedUser = await userService.updateUsersCloths({ '_id': req.userId }, newCloth._id);

        if (!updatedUser) {
            return res.status(400).json({
                error: "Unsuccessful adding cloth to user"
            });
        }

        return res.status(200).json({clothId: newCloth.id});

    } catch (error) {
        res.redirect('/home');
        res.end();
        return;
    }
});

app.get('/cloth-details/:id', auth, async(req, res) => {
    try{
    const cloth = await clothService.getClothById(req.params.id);
    res.render('cloth-details', {
        layout: 'auth',
        name: cloth.name,
        availability: cloth.availability,
        seasons: cloth.seasons,
        styles: cloth.styles,
        colors: cloth.colors,
        fabrics: cloth.fabrics,
        photo: cloth.photo.substring(cloth.photo.indexOf('upload'))  
    });
    }catch(error){
        res.redirect('/home');
        res.end();
        return;
    }
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

const startServer = async () => {
    await getConnection();
    console.log("Connected to MongoDB");
    app.listen(port, async () => {
        console.log(`Listening from port ${process.env.PORT}`);
    });
}
startServer();

module.exports = app;