import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, RefreshControl, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import {Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import { Item } from '@/types'
import Entypo from 'react-native-vector-icons/Entypo'
import Recurring from '@/components/Recurring'
import { formatDate } from '@/lib/utils'
import { router, useLocalSearchParams } from 'expo-router'
import { deleteNotificationById } from '@/lib/pushNotification'
import { openDatabaseAsync } from '@/database/db'
import { deleteItem, getItems } from '@/database/queries'
import ItemCard from '@/components/ItemCard'

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
}
LocaleConfig.defaultLocale = 'jp'

const markedDates = {
  '2025-01-01': { selected: true, selectedColor: '#239a3b' },
  '2025-01-02': { selected: true, selectedColor: '#7bc96f' },
  '2025-01-03': { selected: true, selectedColor: '#c6e48b' },
  '2025-01-04': { selected: true, selectedColor: '#e0e0e0' },
}


const Calendar = () => {
  const [items, setItems] = useState<Item[]>([])
  const [itemOnModal, setItemOnModal] = useState<Item | null>(null)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })

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
    <SafeAreaView className='h-full'>
      <CalendarComponent
        onDayPress={day => {
          console.log('selected day', day);
        }}
        markedDates={markedDates}
      />
      <Text>今日のトレーニング</Text>
      <FlatList
        data={ items }
        keyExtractor={ item => item.id.toString() }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
          />
        )}
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
    </SafeAreaView>
  )
}

export default Calendar