const { getConnection, Schema, mongoose } = require('../db');
getConnection();

const clothModel = mongoose.model('Cloths', new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    availability: {
        type: Boolean
    },
    seasons: [{
        seasonName: String, 
        required: [true, "Check one of the sesons"],
        min: 4,
        max: 128
    }],
    styles: [{
        styleName: String,
        required: [true, "Check one of the style"],
        min: 4,
        max: 128
    }],
    colors: [{
        colorHex: String,
    }],
    fabric:[{
        layerName: String,
    }],
    cleaning:{
        mashineWash: {
            type: Array, 
            default: ['normal', 'normal']
        },
        handWash: Boolean,
        doNotWash: Boolean,
        doNotWring: Boolean,
        wetClean: Boolean,
        bleach: String,
        dry: {
            doNotDry: Boolean,
            tumbleDry:{
                type: Array, 
                default: []
            },
            lineDry: {
                recommended: Boolean,
                inShade: Boolean
            },
            dripDry: {
                recommended: Boolean,
                inShade: Boolean
            },
            flatDry: {
                recommended: Boolean,
                inShade: Boolean
            },
        },
        iron :{
            heat: String,
            steam: Boolean
        },
        dryClean: Boolean
    }
})
);

module.exports = clothModel;

// db.clothes.insertOne({
//     name: "Strip blouse",
//     availability: true,
//     seasons: ["spring", "fall"], //summer, winter
//     styles: ["casual", "minimalist"],
//     color: ["#FFFFFF", "#000000"],
//     fabric: [
//         //synthetic: acrylic, nylon, polyester, spandex, rayon
//         //plant-based: bamboo, cotton, lyocell, modal, sisal, linen (flax)
//         //animal-based: alpaca, angora wool, cashmere wool, mohair wool, silk, wool, yak, leather
//         //check: microfiber, velour, suede (leather), satin, spandex, tweed, twill, velvet, viscose, jersey, lace
//         { shell: "wool"},  
//         { lining: "polyester"},
//         { padding: "down"} // felt, down, feathers
//     ],
//     cleaning: {
//         mashineWash: [
//             "normal", //normal, cold, warm, hot-50, hot-60, hot-70, hot-95
//             "permanent-press", //gentle, normal   
//         ],
//         handWash: "none", //normal, cold, warm
//         doNotWash: false, //true
//         doNotWring: true, //false
//         wetClean: true, //false
//         bleach: "do not", //if needed, non-chlorine, chlorine
//         dry: { //one from options below - should I create another collection for this?
//             doNotDry: false,
//             tumbleDry: [
//                 "normal", //low heat, medium heat, high, no heat
//                 "permanent-press", //normal, gentle
//             ],
//             lineDry: {
//                 recommended: true,
//                 inShade : false
//             },
//             dripDry: {
//                 recommended: true,
//                 inShade : false
//             },
//             flatDry: {
//                 recommended: true,
//                 inShade : false
//             }
//         },
//         iron: { // lack of this field means do not iron
//             heat: "any temperature", //low heat, high heat,
//             steam: true, //false
//         },
//         dryClean: true //false
//     }
// });