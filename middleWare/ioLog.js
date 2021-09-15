/**
 * Created by Mishok on 13.12.2017.
 */
var fs = require('fs').promises;

const read = async (fileName) => {
    console.log('module ioLog read fileName: ', fileName);
    try{
        return await fs.readFile('./userCSV/'+fileName, {encoding: 'UTF-8'});
    } catch(err){
        return err;
    }
};

const append = async (fileName,txt) => {
    console.log('module ioLog append fileName: ', fileName);
    try{
        return await fs.appendFile('./userCSV/'+fileName, txt + '\r',);
    } catch(err){
        return err;
    }
};



module.exports.r = read;
module.exports.a = append;


