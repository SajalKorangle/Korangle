
// 1. Whoever is calling getFixtureFiles function should provide the fileObjectListFileName argument
//    w.r.t. the location of fixture-map.js as it is used in require.
// 2. "../backend/fixtures/version/" is used assuming the script is running from frontend folder. In future
//    the responsibility can also be transferred to backend-server.ts file.

const fs = require('fs');

export function getFixtureFiles(fileObjectListFileName) {
    return getFileObjectList(require('./' + fileObjectListFileName)).map(
        item => '../backend/fixtures/versions/' + item.app + '/' + item.model + '/' + item.file
    ).join(' ');
}

function getFileObjectList(fileObjectList) {
    let newFileObjectList = mergeFileObjectListWithoutRepeating([], fileObjectList);
    fileObjectList.forEach(fileObject => {
        newFileObjectList = mergeFileObjectListWithoutRepeating(
            newFileObjectList,
            getFileObjectList(getFileObjectListFromFileObject(fileObject))
        );
    });
    return newFileObjectList;
}

function mergeFileObjectListWithoutRepeating(fileObjectListTo, fileObjectFrom) {
    fileObjectFrom.forEach(fromItem => {
        if (fileObjectListTo.find(toItem => {
            return toItem.app === fromItem.app && toItem.model === fromItem.model;
        }) === undefined) {
            fileObjectListTo.push(fromItem);
        }
    });
    return fileObjectListTo;
}

function getFileObjectListFromFileObject(fileObject) {
    // path is relative to the folder from where command is run terminal
    if (fs.existsSync('../backend/fixtures/versions/' + fileObject.app + '/' + fileObject.model + '/map.json')) {
        // path is relative to this file.
        const fileMappedToFileObjectList = require('../../../backend/fixtures/versions/' + fileObject.app + '/' + fileObject.model + '/map.json');
        return fileMappedToFileObjectList.find(fixtureFile => {
            return fixtureFile.file === fileObject.file;
        }).file_object_list;
    } else {
        return [];
    }
}
