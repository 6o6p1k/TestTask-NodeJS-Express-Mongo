
var mongoose = require("./mongoose");


var user = new mongoose.Schema({
    userName: {type: String, unique: true, required: true}, //lowercase: true,
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number, required: true},
});

//Store methods
user.statics.storeUsers = async function (usersArray) {//write users array to db
    let User = this;
    let user = {};

    try {
        usersArray.forEach(itm => {
            user = new User({
                userName: itm['User Name'],
                firstName: itm['First Name'],
                lastName: itm['Last Name'],
                age: itm.Age,
            });
        user.save();
        });
        return {err:null,users:User.find({})};

    } catch(err) {
        console.log('userMFCTBC err: ',err);
        return {err:err,user:null};
    }
};











module.exports.User = mongoose.model('User', user);






