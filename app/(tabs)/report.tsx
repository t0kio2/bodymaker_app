import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
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

const Report = () => {
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-white'>
        <Text>継続度カレンダー</Text>
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
                  <Text key={i} style={{ height: BOX_SIZE, marginBottom: BOX_MARGIN, textAlign: 'right', fontSize: 10 }}>{day}</Text>
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
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Report