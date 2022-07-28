import {PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import * as FileUtils from './FileUtils';

/**
 * Android permission check to store images
 * @returns {Promise<Boolean>}
 */
function hasAndroidPermission() {
    // Read and write permission
    const writePromise = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    const readPromise = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

    return Promise.all([writePromise, readPromise]).then(([hasWritePermission, hasReadPermission]) => {
        if (hasWritePermission && hasReadPermission) {
            return true; // Return true if permission is already given
        }

        // Ask for permission if not given
        return PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]).then(status => status['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
                    && status['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted');
    });
}

/**
 * Handling the download
 * @param {String} url
 * @param {String} fileName
 * @returns {Promise<Void>}
 */
function handleDownload(url, fileName) {
    return new Promise((resolve) => {
        const dirs = RNFetchBlob.fs.dirs;

        // Android files will download to Download directory
        const path = dirs.DownloadDir;
        const attachmentName = fileName || FileUtils.getAttachmentName(url);

        // Fetching the attachment
        const fetchedAttachment = RNFetchBlob.config({
            fileCache: true,
            path: `${path}/${attachmentName}`,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${path}/Expensify/${attachmentName}`,
            },
        }).fetch('GET', url).then((attachment) => {
            const localUrl = Platform.OS === "android" ?  "file://"+attachment.data : attachment.data
            console.log("HELLO => href => ", localUrl);
            if (!attachment || !attachment.info()) {
                resolve(localUrl);
                return localUrl;
            } else {
                resolve(localUrl);
            }
        }).catch(() => {
            resolve(null);
        });

        // Resolving the fetched attachment
        // const file = await fetchedAttachment.then((attachment) => {
        //     const localUrl = Platform.OS === "android" ?  "file://"+attachment.data : attachment.data
        //     console.log("HELLO => href => ", localUrl);
        //     if (!attachment || !attachment.info()) {
        //         resolve(localUrl);
        //         return;
        //     } else {
        //         resolve(localUrl);
        //     }
        //     // FileUtils.showSuccessAlert();
        // }).catch(() => {
        //     // FileUtils.showGeneralErrorAlert();
        // });
        // console.log("HELLO => hr213123ef => ", file);
    });
}

/**
 * Checks permission and downloads the file for Android
 * @param {String} url
 * @param {String} fileName
 * @returns {Promise<Void>}
 */
export default function fileDownload(url, fileName) {
    return new Promise((resolve) => {
        hasAndroidPermission().then((hasPermission) => {
            if (hasPermission) {
                return handleDownload(url, fileName).then((file) => resolve(file)).catch(() => resolve(null));
            } else {
                resolve(null);
            }
            FileUtils.showPermissionErrorAlert();
        }).catch(() => {
            resolve(null);
            FileUtils.showPermissionErrorAlert();
        })
        // .finally(() => resolve());
    });
}
