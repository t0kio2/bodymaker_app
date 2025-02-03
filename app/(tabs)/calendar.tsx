import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, RefreshControl, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import {Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import { Item } from '@/types'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import Recurring from '@/components/Recurring'
import { formatDate } from '@/lib/utils'
import { router, useLocalSearchParams } from 'expo-router'
import { deleteNotificationById } from '@/lib/pushNotification'
import { openDatabaseAsync } from '@/database/db'
import { deleteItem, getItems } from '@/database/queries'

import Svg, { Rect } from 'react-native-svg'
import { eachDayOfInterval, endOfYear, format, getDay, getISOWeek, startOfYear } from 'date-fns'

// 定数設定
const BOX_SIZE = 18 // ボックスサイズ
const BOX_MARGIN = 4 // ボックスの感覚
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] // 曜日ラベル
const COLOR_MAP = ['#e0e0e0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] // 色の濃淡

const now = new Date()
const start = startOfYear(now)
const end = endOfYear(now)
const daysInMonth = eachDayOfInterval({ start, end })

const dummyData = daysInMonth.map((date) => ({
  date,
  value: Math.floor(Math.random() * 5), // 貢献度 0〜4
}))

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
      <ScrollView horizontal>
        <View style={{ padding: 10 }}>
          {/* 📌 X軸（月のラベル） */}
          <View style={{ flexDirection: 'row', marginLeft: 40, marginBottom: 5 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Text key={i} style={{ width: (BOX_SIZE + BOX_MARGIN) * 4.3, textAlign: 'center', fontSize: 12 }}>
                {MONTH_NAMES[i]} {/* 各月のラベル */}
              </Text>
            ))}
          </View>

          <View style={{ flexDirection: 'row' }}>
            {/* 📌 Y軸（曜日のラベル） */}
            <View style={{ justifyContent: 'center', marginRight: 5 }}>
              {WEEKDAYS.map((day, i) => (
                <Text key={i} style={{ height: BOX_SIZE, textAlign: 'right', fontSize: 10 }}>{day}</Text>
              ))}
            </View>

            {/* 📌 ヒートマップ本体 */}
            <Svg width={(BOX_SIZE + BOX_MARGIN) * 53} height={(BOX_SIZE + BOX_MARGIN) * 7}>
              {dummyData.map((d, i) => {
                const week = getISOWeek(d.date) - 1; // 週番号（ISO基準、1週目を0から始める）
                const dayOfWeek = getDay(d.date); // 曜日 (0: 日曜, 6: 土曜)

                return (
                  <Rect
                    key={format(d.date, 'yyyy-MM-dd')}
                    x={week * (BOX_SIZE + BOX_MARGIN)}
                    y={dayOfWeek * (BOX_SIZE + BOX_MARGIN)}
                    width={BOX_SIZE}
                    height={BOX_SIZE}
                    fill={COLOR_MAP[d.value]}
                    rx={3}
                  />
                );
              })}
            </Svg>
          </View>
        </View>
      </ScrollView>
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
          <View className='flex-col m-2'>
            <View className='flex-row items-center'>
              <View className='flex-row ml-2'>
                {/* サムネイル */}
                <TouchableOpacity
                  className='mr-2'
                  onPress={() => { /* TODO */ }}
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

export default Calendar