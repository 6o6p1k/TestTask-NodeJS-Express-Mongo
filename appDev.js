const express = require('express')
var http = require('http');
var config = require('./config');
const app = express();
var ip = require('ip');
var readFile = require('./middleWare/ioLog').r;
var writeFile = require('./middleWare/ioLog').a;
var User = require('./middleWare/userStore').User;
var csv = require('csvtojson');
var path = require('path');



//to read file and send to the web go to page http://localhost:3000/
app.get('/', function (req, res) {//
    readFile('SampleUsers.csv',function (err,data) {
        if (err) {
            console.log('read file err', err);
            res.status(500).send('Something went wrong while reading from file!'+' Err Message: '+err);
        } else {
            console.log("read file data: ",data);
            res.send(data)
        }
    });
});

//to store users to DB go to page http://localhost:3000/writeToDB
app.get('/writeToDB', async function (req, res) {
    try {
        const jsonArray = await csv().fromFile('./userCSV/SampleUsers.csv');
        console.log("jsonArray: ",jsonArray);
        const {err,data} = await User.storeUsers(jsonArray);
        if(err) return res.status(500).send('Something went wrong while storing to DB!'+' Err Message: '+err);
        res.json(jsonArray);
    }catch (err){
        console.log("store users from csv file err: " ,err)
    }
});

//store users to csv file http://localhost:3000/getUsersDB
app.get('/getUsersDB', async function (req, res) {//read users stored in DB
    const { parse } = require('json2csv');
    const fields = ['userName', 'firstName', 'lastName' ,'age'];
    const opts = { fields };

    try {
        let users = await User.find({});
        const csv = parse(users, opts);
        console.log("getUsersDB csv: ",csv);
        writeFile('users.csv',csv,function (err) {
            if (err) {
                console.log('write file err', err);
                res.status(500).send('Something went wrong while writing to file!'+' Err Message: '+err);
            }
        });
        res.json(users)
    } catch (err){
        if(err)  res.status(500).send('Something went wrong while writing to file!'+' Err Message: '+err);
    }
});

//to get csv file with users stored in DB go to page http://localhost:3000/file/users.csv
app.get('/file/:name', function (req, res) {
    var options = {
        root: path.join(__dirname, 'userCSV'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.name;
    console.log('fileName: ',fileName);
    res.sendFile(fileName, options, function (err) {
        if (err) {
            return res.status(500).send('Something went wrong while sending file!'+' Err Message: '+err);
        } else {
            console.log('Sent file:', fileName)
        }
    })
})

//Create Server
var server = http.createServer(app);
server.listen(config.get('port'), function(){
    console.log('Express server listening on ip:',ip.address(),',port:',config.get('port'));
});