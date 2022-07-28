import _ from 'underscore';
import React from 'react';
import lodashGet from 'lodash/get';
import {Linking, StyleSheet, Pressable} from 'react-native';
import Str from 'expensify-common/lib/str';
import {propTypes, defaultProps} from '../anchorForCommentsOnlyPropTypes';
import fileDownload from '../../../libs/fileDownload';
import Text from '../../Text';
import PressableWithSecondaryInteraction from '../../PressableWithSecondaryInteraction';
import * as ReportActionContextMenu from '../../../pages/home/report/ContextMenu/ReportActionContextMenu';
import * as ContextMenuActions from '../../../pages/home/report/ContextMenu/ContextMenuActions';
import AttachmentView from '../../AttachmentView';
import styles from '../../../styles/styles';
import VideoList from '../../../libs/actions/VideoList';

/*
 * This is a default anchor component for regular links.
 */
class BaseAnchorForCommentsOnly extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDownloading: false,
        };
        this.processDownload = this.processDownload.bind(this);
    }
    
    componentDidMount() {
        VideoList.getLocalPaths().then(filesList => {
            const uri = this.props.href?.split?.("?")?.[0];
            console.log("this.props.href => ",uri)
            const fileIndex = filesList?.findIndex?.(item => item.uri === uri);
            if(this.props.href && filesList?.length && typeof fileIndex === "number"){
                this.setState({localFileURL: filesList[fileIndex].localFileURL})
            }
        })
    }

    /**
     * Initiate file downloading and update downloading flags
     *
     * @param {String} href
     * @param {String} fileName
     */
    processDownload(href, fileName) {
        this.setState({isDownloading: true});
        VideoList.getLocalPaths().then(filesList => {
            filesList = filesList ?? [];
            if (href.split("?")?.[0] && filesList.findIndex(item => item.uri === href.split("?")?.[0]) === -1){
                fileDownload(href, fileName).then((file) => {
                    console.log("FILE PATHS => ", file)
                    if(typeof file === "string") {
                        VideoList.setVideoLocalList({localFileURL: file, uri: href.split("?")?.[0] })
                    }
                    this.setState({isDownloading: false})
                });
            }
        })
    }

    render() {
        let linkRef;
        const rest = _.omit(this.props, _.keys(propTypes));
        return (
            this.props.isAttachment
                ? (
                    <Pressable
                        style={styles.mw100}
                        onPress={() => {
                            if (this.state.isDownloading) {
                                return;
                            }
                            this.processDownload(this.props.href, this.props.displayName);
                        }}
                    >
                        <AttachmentView
                            sourceURL={this.state.localFileURL ?? this.props.href}
                            file={{name: this.props.displayName}}
                            shouldShowDownloadIcon
                            shouldShowLoadingSpinnerIcon={this.state.isDownloading}
                        />
                    </Pressable>
                )
                : (
                    <PressableWithSecondaryInteraction
                        inline
                        onSecondaryInteraction={
                        (event) => {
                            ReportActionContextMenu.showContextMenu(
                                Str.isValidEmail(this.props.displayName) ? ContextMenuActions.CONTEXT_MENU_TYPES.EMAIL : ContextMenuActions.CONTEXT_MENU_TYPES.LINK,
                                event,
                                this.props.href,
                                lodashGet(linkRef, 'current'),
                            );
                        }
                    }
                        onPress={() => Linking.openURL(this.props.href)}
                    >
                        <Text
                            ref={el => linkRef = el}
                            style={StyleSheet.flatten(this.props.style)}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                            {...rest}
                        >
                            {this.props.children}
                        </Text>
                    </PressableWithSecondaryInteraction>
                )
        );
    }
}

BaseAnchorForCommentsOnly.propTypes = propTypes;
BaseAnchorForCommentsOnly.defaultProps = defaultProps;
BaseAnchorForCommentsOnly.displayName = 'BaseAnchorForCommentsOnly';

export default BaseAnchorForCommentsOnly;
