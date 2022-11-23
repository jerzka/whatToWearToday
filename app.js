const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { getConnection, initializeFirebase } = require("./db/db");
const userService = require("./controllers/user.controller");
const clothService = require("./controllers/cloth.controller");
const cookieParser = require("cookie-parser");
const { auth, authGuard } = require('./middelwares/auth');
const { uploadPhoto } = require('./middelwares/upload');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT;

app.engine('handlebars', engine());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialDir: path.join(__dirname, '/views/partials'),
    extname: 'hbs',
    helpers: require(path.join(__dirname, '/client/public/handlebar-helpers')) //only need this

}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(cookieParser());
app.use(
    fileUpload({
        limits: {
            fileSize: 1000000,
        },
        abortOnLimit: true,
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
        let clothes;
        const searchText = req.query.search;
        if(searchText === undefined || searchText === ''){
            clothes = await clothService.getByUserId(req.userId);
        }else{
            clothes = await clothService.getBySearchText(searchText);
        }
        res.render('home', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="../carousel.css">`,
            customscript: `<script src="home.js"></script>`,
            user: req.userName,
            clothes: clothes
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
            customstyle: `<link rel="stylesheet" href="../auth-forms.css">`,
            customscript: `<script src="cloth.js"></script>`,
            edit: false,
            user: req.userName
        })
    } catch (error) {
        res.redirect('/signin');
        res.end();
        return;
    }
});

app.post('/add-cloth', auth, uploadPhoto, async (req, res) => {
    const formData = req.body;
    
    if (!req.userId || req.userId === 0) {
        return res.status(401).json({
            error: "User not found"
        });
    } 

    try {
        const clothData = {
            user: req.userId,
            name: formData.name,
            availability: formData.availability,
            seasons: JSON.parse(formData.seasons),
            styles: JSON.parse(formData.styles),
            colors: JSON.parse(formData.colors),
            fabrics: JSON.parse(formData.fabrics),
            photo: req.photoUrl
        }
        const newCloth = await clothService.store(clothData);
        if (!newCloth) {
            return res.status(400).json({
                error: "Unsuccessful create new cloth"
            });
        }
        return res.status(200).json({ clothId: newCloth.id });

    } catch (error) {
        res.redirect('/home');
        res.end();
        return;
    }
});

app.get('/cloth-details/:id', auth, async (req, res) => {
    try {
        const cloth = await clothService.getById(req.params.id);
        res.render('cloth-details', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="../cloth.css">`,
            user: req.userName,
            id: cloth._id,
            name: cloth.name,
            availability: cloth.availability,
            seasons: cloth.seasons,
            styles: cloth.styles,
            colors: cloth.colors,
            fabrics: cloth.fabrics,
            photo: cloth.photo
        });
    } catch (error) {
        res.redirect('/home');
        res.end();
        return;
    }
});

app.get('/cloth-form/:id', auth, async (req, res) => {
    try {
        const cloth = await clothService.getById(req.params.id);
        res.render('cloth-form', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="../auth-forms.css">`,
            customscript: `<script src="../cloth.js"></script>`,
            edit: true,
            user: req.userName,
            id: cloth._id,
            name: cloth.name,
            availability: cloth.availability,
            seasons: cloth.seasons,
            styles: cloth.styles,
            colors: cloth.colors,
            fabrics: cloth.fabrics,
            photo: cloth.photo
        });
    } catch (error) {
        res.redirect('/signin');
        res.end();
        return;
    }
});

app.post('/update-cloth/:id', auth, uploadPhoto, async (req, res) => {
    const data = req.body;

    if (!req.userId || req.userId === 0) {
        return res.status(401).json({
            error: "User not found"
        });
    }

    try {
        const clothData = {
            id: data.id,
            name: data.name,
            availability: data.availability,
            seasons: JSON.parse(data.seasons),
            styles: JSON.parse(data.styles),
            colors: JSON.parse(data.colors),
            fabrics: JSON.parse(data.fabrics),
            photo: req.photoUrl
        }
        const updatedCloth = await clothService.updateOne(clothData);
        if (!updatedCloth) {
            return res.status(400).json({
                error: "Unsuccessful update new cloth"
            });
        }

        return res.status(200).json({ clothId: updatedCloth._id });

    } catch (error) {
        res.redirect('/home');
        res.end();
        return;
    }
});

app.get('/outfit-form', auth, async (req, res) => {
    try {
        const clothes = await clothService.getByUserId(req.userId);

        const clothesMatrics = (arr, chunkSize)  => {
                const result = [];
                while (arr.length > 0) {
                    const chunk = arr.splice(0, chunkSize);
                    result.push({chunk: chunk});
                }
                console.log(result)
                return result;
            }
        const newClothesArr = clothesMatrics(clothes, 3);

        res.render('outfit-form', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="../auth-forms.css">
                        <link rel="stylesheet" href="../carousel.css">`,
            customscript: `<script src="outfit.js"></script>`,
            edit: false,
            user: req.userName,
            clothes: newClothesArr
        })
    } catch (error) {
        res.redirect('/signin');
        res.end();
        return;
    }
});

app.get('/signout', (req, res) => {
    res.cookie('token', '');
    // res.status(200).send({
    //     message: 'Signout out successfully'
    // });
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
    await initializeFirebase();
    app.listen(port, async () => {
        console.log(`Listening from port ${process.env.PORT}`);
    });
}
startServer();

module.exports = app;