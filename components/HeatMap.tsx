import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Svg, { Rect, Text as SvgText } from 'react-native-svg'
import { 
  eachDayOfInterval, endOfYear, format, getDay, startOfYear, startOfMonth, 
  differenceInCalendarWeeks, subDays 
} from 'date-fns'

const HeatMap = () => {
  const boxSize = 18
  const margin = 4
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const colors = ['#e0e0e0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']

  const now = new Date()
  const startYear = startOfYear(now)
  const firstSunday = getDay(startYear) === 0 ? startYear : subDays(startYear, getDay(startYear))
  const endYear = endOfYear(now)
  const days = eachDayOfInterval({ start: startYear, end: endYear })

  // 各日付にランダムな値（0〜4）を設定
  const data = days.map(date => ({
    date,
    value: Math.floor(Math.random() * 5)
  }))

  // 各月の初日位置を計算
  const months = monthNames.map((name, idx) => {
    const firstOfMonth = startOfMonth(new Date(now.getFullYear(), idx, 1))
    const weekIndex = differenceInCalendarWeeks(firstOfMonth, firstSunday, { weekStartsOn: 0 })
    return { name, x: weekIndex * (boxSize + margin) }
  })

  const totalWeeks = differenceInCalendarWeeks(endYear, firstSunday, { weekStartsOn: 0 }) + 1
  const svgWidth = totalWeeks * (boxSize + margin)
  const svgHeight = 20 + 7 * (boxSize + margin) // 20px分は月ラベル用

  return (
    <ScrollView horizontal>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        {/* 曜日ラベル */}
        <View style={{ marginRight: 5 }}>
          <View style={{ height: 20 }} />
          {weekdays.map(day => (
            <View key={day} style={{ height: boxSize + margin, justifyContent: 'center' }}>
              <Text style={{ fontSize: 10, textAlign: 'right' }}>{day}</Text>
            </View>
          ))}
        </View>
        {/* カレンダーグリッド */}
        <Svg width={svgWidth} height={svgHeight}>
          {/* 月ラベル */}
          {months.map(m => (
            <SvgText
              key={m.name}
              x={m.x + boxSize / 2}
              y={10}
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              fill="black"
            >
              {m.name}
            </SvgText>
          ))}
          {data.map(d => {
            const weekIndex = differenceInCalendarWeeks(d.date, firstSunday, { weekStartsOn: 0 })
            const dayIndex = getDay(d.date)
            const x = weekIndex * (boxSize + margin)
            const y = dayIndex * (boxSize + margin) + 20
            return (
              <React.Fragment key={format(d.date, 'yyyy-MM-dd')}>
                <Rect
                  x={x}
                  y={y}
                  width={boxSize}
                  height={boxSize}
                  fill={colors[d.value]}
                  rx={3}
                />
                <SvgText
                  x={x + boxSize / 2}
                  y={y + boxSize / 2}
                  fontSize="8"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="black"
                >
                  {format(d.date, 'd')}
                </SvgText>
              </React.Fragment>
            )
          })}
        </Svg>
      </View>
    </ScrollView>
  )
}

export default HeatMap
