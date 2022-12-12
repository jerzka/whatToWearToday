const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { getConnection, initializeFirebase } = require("./db/db");
const userService = require("./controllers/user.controller");
const clothService = require("./controllers/cloth.controller");
const outfitService = require("./controllers/outfit.controller");
const cookieParser = require("cookie-parser");
const { auth, authGuard } = require('./middelwares/auth');
const { uploadPhoto, uploadCanvas } = require('./middelwares/upload');
const fileUpload = require('express-fileupload');
const cors = require('cors');


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

app.use(cors());
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
app.get('/', async (req, res) => {
    try{
        const outfits = await outfitService.getAll();
        console.log(outfits);

        res.render('intro', {
            layout: 'main',
            customstyle: `<link rel="stylesheet" href="carousel.css">`,
            customscript: `<script src="index.js"></script>`,
            outfits: outfits
        });
    } catch (error) {
        res.redirect('/signin');
        res.end();
        return;
    }
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
    } catch (error) {
        res.status(error.code).json({
            error: error.msg
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
        if(searchText == null || searchText === ''){
            clothes = await clothService.getByUserId(req.userId);
        }else{
            clothes = await clothService.getBySearchText(searchText);
        }
        const outfits = await outfitService.getByUserId(req.userId);
        const otherOutfits = await outfitService.getExcludedByUserId(req.userId);

        res.render('home', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="carousel.css">`,
            customscript: `<script src="home.js"></script>
                           <script src="rating.js"></script>`,
            user: req.userName,
            clothes: clothes,
            outfits: outfits,
            otherOutfits: otherOutfits
        })
    } catch (error) {
        res.redirect('/signin');
        res.end();
        return;
    }

});

app.get('/cloth-form', auth, async (req, res) => {
    try {
        res.render('cloth-form', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="../auth-forms.css">`,
            customscript: `<script src="../form-helpers.js"></script>
                           <script src="../cloth.js"></script>`,
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
            name: JSON.parse(formData.name),
            availability: formData.availability,
            seasons: JSON.parse(formData.seasons),
            styles: JSON.parse(formData.styles),
            types: JSON.parse(formData.types),
            decors: JSON.parse(formData.decors),
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
        const chosenCloths = await clothService.getMatched(req.userId, cloth.decors, cloth.types);
        res.render('cloth-details', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="../cloth.css">`,
            customscript: `<script src="../form-helpers.js"></script>
                           <script src="../details.js"></script>`,
            user: req.userName,
            id: cloth._id,
            name: cloth.name,
            availability: cloth.availability,
            seasons: cloth.seasons,
            styles: cloth.styles,
            types: cloth.types,
            colors: cloth.colors,
            fabrics: cloth.fabrics,
            photo: cloth.photo,
            chosenCloths: chosenCloths,
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
            customscript: `<script src="../form-helpers.js"></script>
                           <script src="../cloth.js"></script>`,
            edit: true,
            user: req.userName,
            id: cloth._id,
            name: cloth.name,
            availability: cloth.availability,
            seasons: cloth.seasons,
            styles: cloth.styles,
            types: cloth.types,
            decors: cloth.decors,
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

app.put('/update-cloth/:id', auth, uploadPhoto, async (req, res) => {
    const data = req.body;
    if (!req.userId || req.userId === 0) {
        return res.status(401).json({
            error: "User not found"
        });
    }
    let clothData={};
    const keys = Object.keys(data);
    keys.forEach((key, index) => {
        console.log(JSON.parse(data[key]));
            clothData[key] = JSON.parse(data[key]);

    });
    clothData["photo"] = req.photoUrl;  

    try {
        const updatedCloth =  await clothService.updateOne(clothData, req.params.id);
        if (!updatedCloth) {
            return res.status(400).json({
                error: "Unsuccessful update cloth"
            });
        }

        return res.status(200).json({ clothId: updatedCloth._id });

    } catch (error) {
        res.redirect('/home');
        res.end();
        return;
    }
});

app.delete('/cloth-details/:id', auth, async(req, res) => {
    try{
        const id = req.params.id;
        await clothService.deleteItem(id);

        return res.status(200).json({
            message: "item deleted sucessfully",
        });
            
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
            customstyle: `<link rel="stylesheet" href="auth-forms.css">
                          <link rel="stylesheet" href="carousel.css">`,
            customscript: `<script src="form-helpers.js"></script>
                           <script src="outfit.js"></script>`,
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

app.post('/add-outfit', auth, uploadCanvas, async (req, res) => {
    const formData = req.body;
    
    if (!req.userId || req.userId === 0) {
        return res.status(401).json({
            error: "User not found"
        });
    } 

    try {
        const itemData = {
            user: req.userId,
            name: req.userName,
            title: formData.title,
            availability: formData.availability,
            privacy: formData.privacy,
            seasons: JSON.parse(formData.seasons),
            occasions: JSON.parse(formData.categories),
            clothes: JSON.parse(formData.clothes),
            photo: req.photoUrl
        }
        const newItem = await outfitService.store(itemData);
        if (!newItem) {
            return res.status(400).json({
                error: "Unsuccessful create new outfit"
            });
        }
        return res.status(200).json({ itemId: newItem.id });

    } catch (error) {
        res.redirect('/signin');
        res.end();
        return;
    }
});

app.get('/outfit-list', auth, async (req, res) => {
    try {

        let outfits;
        const searchText = req.query.search;
        if(searchText == null || searchText === ''){
            outfits = await outfitService.getByUserId(req.userId);
        }else{
            outfits = await outfitService.getBySearchText(searchText);
        }
 
        res.render('outfit-list', {
            layout: 'auth',
            customstyle: `<link rel="stylesheet" href="auth-forms.css">`,
            customscript: `<script src="form-helpers.js"></script>
                           <script src="outfit-list.js"></script>`,
            user: req.userName,
            outfits: outfits
        })
    } catch (error) {
        res.redirect('/signin');
        res.end();
        return;
    }
});

app.delete('/outfit-list/:id', auth, async(req, res) => {
    try{
        const id = req.params.id;
        await outfitService.deleteItem(id);

        res.status(200).json({
            message: "item deleted sucessfully",
        });
        return;
            
    } catch (error) {
        res.redirect('/home');
        res.end();
        return;
    }
});

app.put('/rate-outfit', auth, async (req, res) => {
    if (!req.userId || req.userId === 0) {
        return res.status(401).json({
            error: "User not found"
        });
    } 

    try{
        const data = req.body;
        await outfitService.updateRating(data);

        res.status(200).json({
            message: "rating update sucessfully",
        });
        return; 

    } catch (error) {
        res.redirect('/home');
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