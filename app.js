const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); // Convert json object into javascript object. 
app.use(cookieParser());
// app.use(jwt());

// view engine
app.set('view engine', 'ejs');

// database connection

const dbURI = 'mongodb+srv://KirtiVardhanRay:eh8OSz5kyCEBaaxr@cluster0.asgjhkl.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    app.listen(3000)
    console.log("Server Started on port 3000");
  }).catch((err) => console.log(err));

// routes 
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);