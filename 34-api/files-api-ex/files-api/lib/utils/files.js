const fs = require('fs-extra');
const path = require('path');
const {rootPath} = require('./constants');

/**
 * Currently returns relative path in server file system.
 * @param req
 * @returns {*}
 */
function getCurTargetRealPath(req)
{
    let curTargetPath = rootPath;
    const name = req.params.name;
    if(name) {
        curTargetPath += name;
    }
    return curTargetPath;
}

function getCreatedTargetRealPath(req)
{
    let curTargetPath = rootPath;
    const name = req.body.name;
    if(name) {
        curTargetPath += name;
    }
    return curTargetPath;
}

function doesResourceExist(curTargetRealPath)
{
    return fs.existsSync(curTargetRealPath);
}

function getFilesContent() {
    let result = {}
    // console.log(`treeRecSync: ${queryPath}`);

    try {
        // recursive base case
        const dir = fs.opendirSync(rootPath);
        while (true) {
            let dirEntry = dir.readSync();
            if(!dirEntry) {
                break;
            }
            if( dirEntry.isFile()) {
                result[dirEntry.name] =  getFileContent(`${rootPath}/${dirEntry.name}`);
            }
        }
        dir.closeSync();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


function getFileContent(curTargetRealPath)
{
    try {
        return fs.readFileSync(curTargetRealPath, 'utf8');
    } catch(err) {
        console.log(err);
        throw err;
    }
}

function createFile(curTargetRealPath,req)
{
    try {
       fs.writeFileSync(curTargetRealPath, req.body.content);
    } catch(err) {
        console.log(err);
        throw err;
    }
}

/**
 *
 * @returns {string}
 */
function getCurrentTimeStamp()
{
    const dt = new Date();
    return (`${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')}-${
            dt.getFullYear().toString().padStart(4, '0')}-${
            dt.getHours().toString().padStart(2, '0')}-${
            dt.getMinutes().toString().padStart(2, '0')}-${
            dt.getSeconds().toString().padStart(2, '0')}`
    );
}

function getCopiedTargetRealPath(sourceRealPath)
{
    const sourceBaseName = path.basename(sourceRealPath);
    const sourceParentDir = path.dirname(sourceRealPath);
    const targetBaseName = `${sourceBaseName}-copy-${getCurrentTimeStamp()}`;
    return `${sourceParentDir}/${targetBaseName}`;
}

function duplicateFile(curTargetRealPath)
{
    try {
        const copiedTargetFileRealPath = getCopiedTargetRealPath(curTargetRealPath);
        fs.copySync(curTargetRealPath, copiedTargetFileRealPath);
        return getFileContent(copiedTargetFileRealPath);
    } catch(err) {
        console.log(err);
        throw err;
    }
}

function deleteFile(curTargetRealPath)
{
    try {
        fs.unlinkSync(curTargetRealPath);
    } catch(err) {
        console.log(err);
        throw err;
    }
}


module.exports = {
    getCurTargetRealPath,
    getCreatedTargetRealPath,
    doesResourceExist,
    getFilesContent,
    getFileContent,
    createFile,
    duplicateFile,
    deleteFile,
}
