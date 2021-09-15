
var mongoose = require("./mongoose");


var user = new mongoose.Schema({
    userName: {type: String, unique: true, required: true}, //lowercase: true,
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number, required: true},
});

//Store methods
user.statics.storeUsers = async function (usersArray) {//write users array to db
    try {
        let User = this;
        let user = {};
        for (const itm of usersArray){
                user = new User({
                    userName: itm['User Name'],
                    firstName: itm['First Name'],
                    lastName: itm['Last Name'],
                    age: itm.Age,
                });
            await user.save();
        }
        return User.find({});

    } catch(err) {
        return err;
    }
};

module.exports.User = mongoose.model('User', user);






