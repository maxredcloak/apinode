const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
   user_id: String, 
   password: String,
   nickname: String,
   comment: String,
   permissionLevel: Number

});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

const User = mongoose.model('Users', userSchema);

exports.findByUser_id = (user_id) => {
    return User.find({user_id: user_id});
};
exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        user_id: id
    }, userData);
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({user_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

