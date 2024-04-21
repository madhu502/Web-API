const mongoose = require('mongoose')

// External File
// Functions (connection)
// Make a unique function name
// Export

const connectDatabase = () => {
    mongoose.connect('mongodb+srv://test:test@cluster0.vn8gbyh.mongodb.net/').then(()=>{
        console.log("Database connected!")
    })
}

//Exporting the function

module.exports = connectDatabase
