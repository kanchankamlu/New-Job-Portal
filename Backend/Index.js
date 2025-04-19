const app = require('./App');
const dotenv = require('dotenv');
const Database_Connection = require('./Config/DB');



dotenv.config({path:"./Config/Config.env"});

Database_Connection()

const PORT = process.env.PORT || 5059

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})