import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Video from 'react-native-video'
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useRef } from 'react';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import CONST from '../../CONST';
import Modal from '../Modal';

const propTypes = {
    /** URL to vide */
    sourceURL: PropTypes.string,

    /** Any additional styles to apply */
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.any,
};

const defaultProps = {
    sourceURL: '',
    style: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});

const VideoAttachment = (props) => {
    const playerStatePlaying = PLAYER_STATES.PLAYING;
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [
        playerState, setPlayerState
    ] = useState(playerStatePlaying);
    const [screenType, setScreenType] = useState('content');
    
    const onSeek = (seek) => {
        //Handler for change in seekbar
        videoPlayer?.current?.seek?.(seek);
    };
    
    const onPaused = (playerState) => {
        //Handler for Video Pause
        setPaused(!paused);
        setPlayerState(playerState);
    };
    
    const onReplay = () => {
        //Handler for Replay
        setPlayerState(PLAYER_STATES.PLAYING);
        videoPlayer?.current?.seek?.(0);
    };
    
    const onProgress = (data) => {
        // Video Player will progress continue even if it ends
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            setCurrentTime(data.currentTime);
        }
    };
    
    const onLoad = (data) => {
        setDuration(data.duration);
        setIsLoading(false);
    };
    
    const onLoadStart = (data) => setIsLoading(true);
    
    const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);
    
    const onError = () => alert('Oh! ', error);
    
    const exitFullScreen = () => {
        alert('Exit full screen');
    };
    
    const enterFullScreen = () => {};
    
    const onFullScreen = () => {
        setIsFullScreen(isFullScreen);
        setModalOpen(!modalOpen);
        if (screenType == 'content') setScreenType('stretch');
        else setScreenType('content');
    };
    
    const renderToolbar = () => (
        <View>
        <Text style={styles.toolbar}> toolbar </Text>
        </View>
    );
    
    const onSeeking = (currentTime) => setCurrentTime(currentTime);
    // https://stackoverflow.com/questions/59318412/video-suport-for-react-native-web
    return (
        <View>
            <Modal
                statusBarTranslucent={false}
                type={CONST.MODAL.MODAL_TYPE.CENTERED}
                onClose={() => setModalOpen(false)}
                isVisible={modalOpen}
                backgroundColor={'#000'}
                onModalHide={() => {setScreenType('content')}}
                propagateSwipe
            >
                <Video 
                    source={{uri: props.sourceURL}}
                    onEnd={onEnd}
                    onLoad={onLoad}
                    onLoadStart={onLoadStart}
                    onProgress={onProgress}
                    paused={paused}
                    ref={videoPlayer}
                    resizeMode={screenType}
                    onFullScreen={isFullScreen}
                    volume={10}
                    // source={{uri: "file:///storage/emulated/0/Download/Expensify/ScreenRecording2022-04-22at2.44.10PM.mov"}}
                    onError={(start) => {console.error("ERROR 2",JSON.stringify(start,null,2))}}
                    style={[isFullScreen? {height:Dimensions.get("screen").height, width:Dimensions.get("screen").width,position:"absolute"}:{}]}
                    posterResizeMode="contain"
                />
                <MediaControls
                    duration={duration}
                    isLoading={isLoading}
                    mainColor="#333"
                    onFullScreen={onFullScreen}
                    onPaused={onPaused}
                    onReplay={onReplay}
                    onSeek={onSeek}
                    onSeeking={onSeeking}
                    playerState={playerState}
                    progress={currentTime}
                    toolbar={renderToolbar()}
                />
            </Modal>
            <Video 
                source={{uri: props.sourceURL}}
                onEnd={onEnd}
                onLoad={onLoad}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                paused={paused}
                ref={videoPlayer}
                resizeMode={screenType}
                onFullScreen={isFullScreen}
                volume={10}
                // source={{uri: "file:///storage/emulated/0/Download/Expensify/ScreenRecording2022-04-22at2.44.10PM.mov"}}
                onError={(start) => {console.error("ERROR 2",JSON.stringify(start,null,2))}}
                style={[props.style,isFullScreen? {height:Dimensions.get("screen").height, width:Dimensions.get("screen").width,position:"absolute"}:{}]}
                posterResizeMode="contain"
            />
            <MediaControls
                duration={duration}
                isLoading={isLoading}
                mainColor="#333"
                onFullScreen={onFullScreen}
                onPaused={onPaused}
                onReplay={onReplay}
                onSeek={onSeek}
                onSeeking={onSeeking}
                playerState={playerState}
                progress={currentTime}
                toolbar={renderToolbar()}
            />
        </View>
    )
}

VideoAttachment.propTypes = propTypes;
VideoAttachment.defaultProps = defaultProps;
VideoAttachment.displayName = 'VideoAttachment';

export default VideoAttachment;