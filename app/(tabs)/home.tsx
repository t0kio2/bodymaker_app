import { Alert, FlatList, Image, Linking, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import Recurring from '@/components/Recurring'
import { router, useLocalSearchParams } from 'expo-router'
import { Item } from '@/types'
import { deleteNotificationById } from '@/lib/pushNotification'
import { useDatabase } from '@/hooks/useDatabase'
import { deleteItem, getItems } from '@/database/queries'
import { openDatabaseAsync } from '@/database/db'
import { formatDate } from '@/lib/utils'

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [itemOnModal, setItemOnModal] = useState<Item | null>(null)
  const params = useLocalSearchParams()

  useEffect(() => {
    loadData()
  }, [params?.updated])

  const loadData = async () => {
    try {
      const db = await openDatabaseAsync()
      const items = await getItems(db)
      if (items !== null) {
        setItems(items)
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to load data')
    }
  }

  const openYouTube = (video: string) => {
    if (!video) return
    Linking.openURL(video).catch(err => {
      throw new Error('Failed to open YouTube', err)
    })
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })
  const showDialog = (e: any, item: Item) => {
    const { pageX, pageY } = e.nativeEvent
    setIconPosition({ x: pageX, y: pageY })
    setIsModalVisible(true)
    // モーダルで対象とするアイテムを保持
    setItemOnModal(item)
  }
  const handleEdit = () => {
    setIsModalVisible(false)
    router.push(`/edit?id=${itemOnModal?.id}`)
  }
  const handleDelete = async () => {
    if (!itemOnModal) return
    Alert.alert(
      itemOnModal.title, // タイトル
      '削除してもよろしいですか？', // メッセージ
      [ // ボタン
        {
          text: 'キャンセル',
          style: 'cancel',
          onPress: () => setIsModalVisible(false)
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsModalVisible(false)
            deleteNotificationById(itemOnModal.id)
            const updatedItems = items.filter((item: any) => item.id !== itemOnModal.id)
            try {
              const db = await openDatabaseAsync()
              await deleteItem(db, itemOnModal.id)
              setItems(updatedItems)
              Alert.alert('削除しました')
            } catch (error) {
              throw new Error('Failed to delete item')
            } finally {
              setIsModalVisible(false)
            }
          }
        }
      ]
    )
  }
  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaView className='h-full'>
      <FlatList
        // className='border border-red-500'
        data={ items }
        keyExtractor={ item => item.id.toString()}
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
                    className='w-36 h-24 rounded-xl'
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
                onPress={(e) => showDialog(e, item)}
              >
                <Entypo
                  name='dots-three-vertical'
                  size={20}
                  color='#161622'
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        // ListHeaderComponent={<Text>Header</Text>}
        ListEmptyComponent={<Text>習慣が登録されていません。登録しましょう！</Text>}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
      />
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
          <TouchableOpacity onPress={() => handleEdit()} className="mb-2">
            <Text className="text-blue-500 text-lg">編集</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete()}>
            <Text className="text-red-500 text-lg">削除</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        className='absolute bottom-8 right-8 shadow-lg w-20 h-20 bg-[#161622] rounded-full
        flex items-center justify-center'
        onPress={() => router.push('/create')}
      >
        <Icon name='plus' size={20} color='#FFF' />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
