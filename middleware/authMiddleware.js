const jwt = require('jsonwebtoken');
const User = require('../controllers/model/User');

const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt;

    // Check web token exist and verified
    if(token){
        jwt.verify(token, 'secret key auth', (err, decodedToekn) => {
            if(err){ 
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToekn);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }

}

// Check current user

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'secret key auth', async (err, decodedToekn) => {
            if(err){ 
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToekn);
                let user = await User.findById(decodedToekn.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }

}

module.exports = {requireAuth, checkUser};