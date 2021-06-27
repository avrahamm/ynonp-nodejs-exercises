const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const {rootPath} = require('./constants');

/**
 * Currently returns relative path in server file system.
 * @param req
 * @returns {*}
 */
function getCurTargetRealPath(req)
{
    let curTargetPath = rootPath;
    const queryPath = req.query.path;
    if(queryPath) {
        curTargetPath += queryPath;
    }
    return curTargetPath;
}

function getResourceFromUrl(req)
{
    const parsedUrl = url.parse(req.originalUrl, true);
    // console.log('parsedUrl = ', parsedUrl);
    return parsedUrl.pathname;
}
function doesResourceExist(curTargetRealPath)
{
    return fs.existsSync(curTargetRealPath);
}
function isResourceTypeConsistent(resourceType, curTargetRealPath)
{
    if (resourceType === '/file/') {
        return fs.lstatSync(curTargetRealPath).isFile();
    }

    // root directory
    if (resourceType === '/directory') {
        return true;
    }

    if (resourceType === '/directory/') {
        return fs.lstatSync(curTargetRealPath).isDirectory();
    }

    return false;
}

function getTargetPathParentDir(req)
{
    const queryPath = req.query.path;
    return queryPath ? path.dirname(queryPath) : "";
}

function treeRecSync(queryPath='') {
    let result = {}
    // console.log(`treeRecSync: ${queryPath}`);

    try {
        // recursive base case
        const dir = fs.opendirSync(rootPath + queryPath);
        while (true) {
            let dirEntry = dir.readSync();
            if(!dirEntry) {
                break;
            }
            const path = queryPath ? `${queryPath}/${dirEntry.name}`
                : dirEntry.name ;
            if( dirEntry.isFile()) {
                result[dirEntry.name] = {
                    type: "file",
                    link: `/file/?path=${path}`,
                    icon: "",
                } ;
            }
            else {
                result[dirEntry.name] = treeRecSync(`${queryPath}/${dirEntry.name}`);
                result[dirEntry.name]['type'] = "directory";
                result[dirEntry.name]['link'] = `/directory/?path=${path}`;
                result[dirEntry.name]['icon'] = `-->`;
            }
        }
        dir.closeSync();
        return result;
    } catch (err) {
        console.error(err);
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

module.exports = {

    getCurTargetRealPath,
    getResourceFromUrl,
    doesResourceExist,
    isResourceTypeConsistent,
    getTargetPathParentDir,
    treeRecSync,
    getCopiedTargetRealPath,
}
