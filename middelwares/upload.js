const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const uploadPhoto = async (req, res, next) => {
    try {
        if (req.files != null && typeof req.files == 'object') {
            if (Object.keys(req.files).length != 0) // if user select file
            {
                const image = req.files.photo;

                if (!/^image/.test(image.mimetype)) {
                    return res.status(400).json({
                        error: "The photo is not a valid image"
                    });
                }

                const storage = getStorage();
                const metadata = {
                    contentType: 'image/png'
                };

                const storageRef = ref(storage, 'upload/' + req.files.photo.name);

                await uploadBytes(storageRef, req.files.photo.data.buffer, metadata);
                const url = await getDownloadURL(storageRef);
                if (url) {
                    console.log('File available at', url);
                    req.photoUrl = url;
                    next();
                }
            }
        } else if (req.params.id != null && req.files == null) {
            next();
        }
    }
    catch (error) {
        return res.status(400).json({
            error: "Uploading image unsuccessful"
        });
    }

}

const uploadCanvas = async (req, res, next) => {
    try{
        const filename = req.body.filename;
        const file = req.body.file;
        let fileBuffer = decodeBase64Image(file);

        const storage = getStorage();
        const metadata = {
            contentType: 'image/png'
        };

        const storageRef = ref(storage, 'upload/' + filename);

        await uploadBytes(storageRef, fileBuffer.data.buffer, metadata);
        const url = await getDownloadURL(storageRef);
        if (url) {
            console.log('File available at', url);
            req.photoUrl = url;
            next();
        }
    }
    catch(error){
        return res.status(400).json({
            error: "Uploading canvas image unsuccessful"
        });
    }
}

const decodeBase64Image = (dataString) => {

    const matches = dataString.match(/^data:.+\/(.+);base64,(.*)$/); 
     let response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');
   
    return response;
}

module.exports = {
    uploadPhoto,
    uploadCanvas
}