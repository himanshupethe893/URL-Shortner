// const mongoose = require('mongoose');
// const URLSchema = new mongoose.Schema({
//     shortId:{
//         type: String,
//         required: true,
//         unique: true,
//         index: true,
//     },
//     redirectURL:{
//         type:String,
//         required: true,
//     },
//     visitHistory:[{timestamp: {type: Number}}],
// },
// {timestamps: true}
// );
// const URL = mongoose.model('url', URLSchema);
// module.exports = URL;

// models/url.js

const mongoose = require('mongoose');
const URLSchema = new mongoose.Schema({
    shortId:{
        type: String,
        required: true,
        unique: true,
        index: true,  // <--- ADD THIS LINE
    },
    redirectURL:{
        type:String,
        required: true,
    },
    visitHistory:[{timestamp: {type: Date}}],
},
{timestamps: true}
);
const URL = mongoose.model('url', URLSchema);
module.exports = URL;
