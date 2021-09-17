const express = require('express')
const http = require('http');
const config = require('./config');
const app = express();
const ip = require('ip');
let readFile = require('./middleWare/ioLog').r;
let readStream = require('./middleWare/ioLog').rs;
let writeFile = require('./middleWare/ioLog').a;
const User = require('./middleWare/userStore').User;
const csv = require('csvtojson');
const { parse } = require('json2csv');
const path = require('path');



//to read file and send to the web go to page http://localhost:3000/
app.get('/', async (req,res)=> {//
    try{
        console.log('/');
        let data = await readFile('SampleUsers.csv');
        res.send(data)
    }catch (err){
        console.log('read file err', err);
        res.status(500).send('Something went wrong while reading from file!'+' Err Message: '+err);
    }
});

//to read file by stream and send to the web go to page http://localhost:3000/rs
app.get('/rs', async (req,res)=> {//
    try{
        console.log('/rs');
        let data = await readStream('SampleUsersBigFile.csv');
        console.log('/rs data', data);
        res.send(data)
    }catch (err){
        console.log('read file err', err);
        res.status(500).send('Something went wrong while reading from file!'+' Err Message: '+err);
    }
});

//to store users to DB go to page http://localhost:3000/writeToDB
app.get('/writeToDB', async  (req,res)=> {
    try {
        console.log('/writeToDB');
        const jsonArray = await csv().fromFile('./userCSV/SampleUsers.csv');
        console.log("jsonArray: ",jsonArray);
        await User.storeUsers(jsonArray);
        return res.send('write users to DB successfully');
    }catch (err){
        console.log("store users from csv file err: " ,err)
        return res.status(500).send('Something went wrong while storing to DB!'+' Err Message: '+err);
    }
});
//to drop users to DB go to page http://localhost:3000/dropUsers
app.get('/dropUsers', async  (req,res)=> {
    try {
        console.log('/dropUsers');
        await User.collection.drop();
        return res.send('drop users successfully');
    }catch (err){
        console.log("drop users err: " ,err);
        return res.status(500).send('Something went wrong while drop users!'+' Err Message: '+err);
    }
});

//store users to csv file http://localhost:3000/getUsersDB
app.get('/getUsersDB', async  (req, res)=> {//read users stored in DB
    try {
        console.log('/getUsersDB');
        const fields = ['userName', 'firstName', 'lastName' ,'age'];
        const opts = { fields };
        let users = await User.find({});
        const csv = parse(users, opts);
        await writeFile('users.csv',csv)
        res.json(users)
    } catch (err){
        console.log("store users to csv file err: " ,err);
        res.status(500).send('Something went wrong while writing to file!'+' Err Message: '+err);
    }
});

//to get csv file with users stored in DB go to page http://localhost:3000/file/users.csv
app.get('/file/:name', async (req, res)=> {
    try{
        const options = {
            root: path.join(__dirname, 'userCSV'),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        const fileName = req.params.name;
        console.log('fileName: ',fileName);
        await res.sendFile(fileName, options);
    }catch(err){
        console.log("get csv file with users stored in DB err: " ,err);
        return res.status(500).send('Something went wrong while get csv file with users stored in DB!'+' Err Message: '+err);
    }
})

//Create Server
var server = http.createServer(app);
server.listen(config.get('port'), function(){
    console.log('Express server listening on ip:',ip.address(),',port:',config.get('port'));
});