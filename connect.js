const mongoose = require('mongoose');
async function connectTOMongooDB(url){
    return mongoose.connect(url);
}

module.exports = {connectTOMongooDB};