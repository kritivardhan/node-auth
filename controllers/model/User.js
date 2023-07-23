const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'minimum password length should be 6 characters']
    },
});
// Fire function after doc saved to db
userSchema.post('save', function(doc, next){
    console.log('New user was created and saved', doc);
    next();
});

// fire a function before doc save
userSchema.pre('save', async function(next){
    console.log('User about to be created', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static methode to login
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
       const auth = await bcrypt.compare(password, user.password);
       if(auth){
            return user;
       }
       throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;