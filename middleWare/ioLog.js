/**
 * Created by Mishok on 13.12.2017.
 */
const fs = require('fs');
const fsp = require('fs').promises;


const rs = function readStream(fileName) {
    let stream = new fs.ReadStream('./userCSV/'+fileName,{encoding: 'UTF-8'});

    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("data", (chunk => {
            console.log("chunk: ",chunk);
            data += chunk;
        }));
        stream.on("end", () => resolve(data));
        stream.on("error", error => reject(error));
    });
}





const read = async (fileName) => {
    console.log('module ioLog read fileName: ', fileName);
    try{
        return await fsp.readFile('./userCSV/'+fileName, {encoding: 'UTF-8'});
    } catch(err){
        return err;
    }
};


const append = async (fileName,txt) => {
    console.log('module ioLog append fileName: ', fileName);
    try{
        return await fsp.appendFile('./userCSV/'+fileName, txt + '\r',);
    } catch(err){
        return err;
    }
};



module.exports.r = read;
module.exports.rs = rs;
module.exports.a = append;


