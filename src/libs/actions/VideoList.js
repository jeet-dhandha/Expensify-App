import Onyx from 'react-native-onyx';
import ONYXKEYS from '../../ONYXKEYS';

let localFilePaths = [];
Onyx.connect({
    key: ONYXKEYS.LOCAL_VIDEO_PATH_URLS,
    callback: (localPathList) => localFilePaths = localPathList ?? []
});

/**
 * @param {Array} activeClients
 */
function setVideoLocalList({localFileURL, uri}) {
    if(localFilePaths.length === 0){
        localFilePaths.push({localFileURL, uri});
    } else {
        const uriIndex = localFilePaths.findIndex(item => item.uri === uri);
        if(uriIndex != -1){
            localFilePaths[uriIndex] = {localFileURL, uri};
        } else {
            localFilePaths.push({localFileURL, uri});
        }
    }
    Onyx.set(ONYXKEYS.LOCAL_VIDEO_PATH_URLS, localFilePaths);
}
function getLocalPaths () {
    return new Promise((resolve) => {
        Onyx.connect({
            key: ONYXKEYS.LOCAL_VIDEO_PATH_URLS,
            callback: (localPathList) => {
                resolve(localPathList)
            }
        });
    })
}
export default {
    setVideoLocalList,
    getLocalPaths
};
