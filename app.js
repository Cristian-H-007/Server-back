const express = require ('express');
const path = require ('path');
const bodyParser = require ('body-parser');
const app = express();
const cors = require("cors");
const bcrypt = require ('bcrypt');
const mongoose = require('mongoose');
const User = require('./public/user');
const user = require('./public/user');

const whiteList = [
    "http://localhost:5173"
  ];
  
  // Now we use cors
  app.use(cors({ origin: whiteList }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// const mongo_uri = 'mongodb+srv://cristiandhernandezh:Loco.12345@cluster0.yup0rs5.mongodb.net/';

// mongoose.connect(mongo_uri, function(err) {
//     if (err) {
//         throw err;
//     }
//     else {
//         console.log('Succesfully connected to ${mongo_uri}');
//     }
// });

const MONGO_URL = `mongodb+srv://cristiandhernandezh:Loco.12345@cluster0.yup0rs5.mongodb.net/`;

   const dbConnection = async () => {
  try {
    // Connecting to database using mongoose
    await mongoose.connect(MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("DB ONLINE!");
  } catch (error) {
    console.log(error);
    throw new Error("There's been an error initializating database");
  }
};
    dbConnection();

app.get('', (req, res) => {
    res.status(200).send('SERVER IS RUNNING')
});

app.post('/register', async (req, res) =>{
    try {
        const {username, password, email} = req.body;

        const user = new User({username, password, email});

        await user.save();
        res.send('USER CREATE');
    } catch (error) {

        res.send('USER ERROR');
    }
    
});

app.post('/authenticate', async (req, res) =>{
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
console.log(user);
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: "Invalid user"
            })
        }
        
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: "Invalid user"
            })
        }

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Unknown error, please contact us to solve it!",
            error
        });
    }
});


const login = async ( req, res = response ) => {
    
}


app.listen(3000, () => {
    console.log('server started');
})

module.exports = app;