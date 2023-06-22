import React from 'react';

const contextRef = React.createRef();

function updateContextMenuReportID(reportID) {
    if (!contextRef.current) {
        return;
    }
    contextRef.current.updateContextMenuReportID(reportID);
}
export {contextRef, updateContextMenuReportID};
