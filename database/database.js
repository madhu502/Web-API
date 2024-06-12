const mongoose = require('mongoose')

// External File
// Functions (connection)
// Make a unique function name
// Export

//connecting datbase
const connectDatabase = () => {
    mongoose.connect('mongodb://localhost:27017/web').then(()=>{
        console.log("Database connected!")
    })
}

//Exporting the function

module.exports = connectDatabase
