const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) { return next(err); }
        user.password = hash;
        next();
    });
});

userSchema.methods.checkPassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    })
};

userSchema.statics.getPermittedUsersIds = async function(permittedUsersStr)
{
    if( !Boolean(permittedUsersStr)) {
        return [];
    }
    const permittedUsersNamesArray = permittedUsersStr.split(',')
        .map(name => name.trim());
    return await this.find({
        name : { $in : permittedUsersNamesArray}
    });
}

module.exports = mongoose.model('User', userSchema);
