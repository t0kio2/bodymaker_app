import { FlatList, Image, Linking, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
// import { VideoView } from 'expo-video' // TODO: 使わなければuninstall
import Recurring from '@/components/Recurring'
import { router } from 'expo-router'

const Home = () => {
  const data = [
    {
      id: 1,
      title: '顔痩せトレーニング', 
      video: 'https://www.youtube.com/watch?v=NV5fKANMzfU',
      thumbnail: 'https://i.ytimg.com/vi/NV5fKANMzfU/hqdefault.jpg',
      schedule: {
        recurring: [1, 3, 5], // For weekly: 0=Sunday, 1=Monday, etc.
        time: '19:00',
      },
      goal: 'まずは2習慣継続!',
      createdAt: '2022-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: '顔痩せトレーニング', 
      video: 'https://www.youtube.com/watch?v=NV5fKANMzfU',
      thumbnail: 'https://i.ytimg.com/vi/NV5fKANMzfU/hqdefault.jpg',
      schedule: {
        recurring: [1, 3, 5], // For weekly: 0=Sunday, 1=Monday, etc.
        time: '19:00',
      },
      goal: 'まずは2習慣継続!',
      createdAt: '2022-01-01T00:00:00Z',
    },
    {
      id: 3,
      title: '顔痩せトレーニング', 
      video: 'https://www.youtube.com/watch?v=NV5fKANMzfU',
      thumbnail: 'https://i.ytimg.com/vi/NV5fKANMzfU/hqdefault.jpg',
      schedule: {
        recurring: [1, 3, 5], // For weekly: 0=Sunday, 1=Monday, etc.
        time: '19:00',
      },
      goal: 'まずは2習慣継続!',
      createdAt: '2022-01-01T00:00:00Z',
    }
  ]
  const formatDate = (dateStr: string) => {
    // ISO形式の日付文字列をDateオブジェクトに変換
    const date = new Date(dateStr);
    // 年、月、日を取得
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0") // 月は0始まりなので+1
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}/${month}/${day}`
  }

  const openYouTube = (video: string) => {
    Linking.openURL(video).catch(err => {
      throw new Error('Failed to open YouTube', err)
    })
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })
  const showDialog = (e: any) => {
    const { pageX, pageY } = e.nativeEvent
    setIconPosition({ x: pageX, y: pageY })
    setIsModalVisible(true)
  }
  const handleEdit = () => {
    setIsModalVisible(false)
    // router.push('/edit')
  }
  const handleDelete = () => {
    setIsModalVisible(false)
  }
  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaView className='h-full'>
      <FlatList
        // className='border border-red-500'
        data={ data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View className='flex-col m-2'>
            <View className='flex-row items-center'>
              {/* リオーダーアイコン */}
              <Icon
                name='align-justify'
                size={20}
                color='#161622' 
              />
              <View className='flex-row ml-2'>
                {/* サムネイル */}
                <TouchableOpacity
                  className='mr-2'
                  onPress={() => openYouTube(item.video)}
                >
                  <Image
                    source={{ uri: item.thumbnail }}
                    className='w-36 h-24'
                  />
                </TouchableOpacity>
                <View className='flex-col'>
                  <Text className='text-lg'>{item.title}</Text>
                  {/* カレンダーアイコン */}
                  <View className='flex-col'>
                    <Recurring schedule={item.schedule} className='mr-1' />
                    <Text className='mt-1'>開始日 {formatDate(item.createdAt)}</Text>
                  </View>
                </View>
              </View>
              {/* 3点リーダー */}
              <TouchableOpacity
                className='h-full absolute right-0 top-1'
                onPress={(e) => showDialog(e)}
              >
                <Entypo
                  name='dots-three-vertical'
                  size={20}
                  color='#161622'
                />
              </TouchableOpacity>
              <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                backdropOpacity={0.1}
                animationInTiming={1} // アニメーション無効
                animationOutTiming={1} // アニメーション無効
                style={{
                  margin: 0,
                  position: "absolute",
                  top: iconPosition.y,
                  left: iconPosition.x - 60, // ダイアログの横位置調整
                }}
                useNativeDriver={true} // チラつき防止
                hideModalContentWhileAnimating={true} // チラつき防止

              >
                <View className="bg-white p-2 rounded shadow-lg">
                  <TouchableOpacity onPress={handleEdit} className="mb-2">
                    <Text className="text-blue-500 text-lg">編集</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete}>
                    <Text className="text-red-500 text-lg">削除</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
        )}
        // ListHeaderComponent={<Text>Header</Text>}
        ListEmptyComponent={<Text>Empty</Text>}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
      />
      <TouchableOpacity
        className='absolute bottom-8 right-8 shadow-lg w-16 h-16 bg-[#161622] rounded-full
        flex items-center justify-center'
        onPress={() => router.push('/create')}
      >
        <Icon name='plus' size={20} color='#FFF' />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  video: {
    width: 50,
    height: 50,
  },
});

export default Home
