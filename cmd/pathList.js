'use strict';

const dirTree = require("directory-tree");

/**
 * getPathList: Get list of folder paths
 * @param path
 * @param opts
 * @returns {*[]}
 */
const getPathList = (path, opts) => {
    const tree = dirTree(path, opts);
    console.log("getPathList.path", path);
    console.log("getPathList.tree", tree);
    const result = [];
    const getChildren = (res, children) => {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.path.indexOf(".") === -1) {
                res.push(child.path.replace(path, "").replace(/\\/g, "/"));
            }
            if (child.children) {
                getChildren(res, child.children);
            }
        }
    }
    if (tree.children) {
        getChildren(result, tree.children);
    }
    return result;
}


module.exports = getPathList
