const getReportIDFromURL = (url) => {
    if(!url) return undefined;
    if(typeof url === "string" && !url.length) return undefined;

    const regex = /\/r\/(\d+)/;
    try {
        const match = url.match(regex);
        if(match) {
          return match[1];
        }
        return undefined;
    } catch (e) {
        return undefined;
    }
}

export default {getReportIDFromURL}