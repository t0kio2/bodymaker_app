import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { VideoView, useVideoPlayer } from 'expo-video'

type VideoPlayer = {
  source: string
  videoRef?: React.RefAttributes<VideoView>['ref'],
  continerStyle: {}
}

const VideoPlayer = ({ source, videoRef, continerStyle }: VideoPlayer) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true
    player.play()
  })
  return (
    <VideoView
        // className='w-full h-[240px]' // NativeWind動かない
      style={continerStyle}
      ref={videoRef}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
    />
  )
}

export default VideoPlayer