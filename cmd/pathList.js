'use strict';

import dirTree from "directory-tree"

/**
 * getPathList: Get list of folder paths
 */
const getPathList = (path, opts) => {
    const tree = dirTree(path, opts);
    const result = [];
    if (!tree) {
        return result;
    }
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


export default getPathList;
