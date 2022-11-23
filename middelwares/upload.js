const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const uploadPhoto = async (req, res, next) => {
    try {
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

        const storage = getStorage();
        const metadata = {
            contentType: 'image/png'
        };

        const storageRef = ref(storage, 'upload/' + image.name);
       
        await uploadBytes(storageRef, image.data.buffer, metadata);
        const url = await getDownloadURL(storageRef);
        if(url){
            console.log('File available at', url);
            req.photoUrl = url;
            next();
        }
    }
    catch (error) {
        return res.status(400).json({
            error: "Uploading image unsuccessful"
        });
    }

}


module.exports = {
    uploadPhoto
}