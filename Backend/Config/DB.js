const mongoose = require('mongoose');


const Database_Connection = () =>{
    mongoose.connect(process.env.DB_URI, {family:4}).then(()=> console.log("Database Is Connected Successfully")).catch(err =>{
        console.log(err,"Faild")
    })
}


module.exports = Database_Connection;