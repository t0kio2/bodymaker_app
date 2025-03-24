import React, { useEffect, useRef } from 'react'
import { View, Text, ScrollView, Dimensions, InteractionManager } from 'react-native'
import Svg, { Rect, Text as SvgText } from 'react-native-svg'
import { 
  eachDayOfInterval, endOfYear, format, getDay, startOfYear, startOfMonth, 
  differenceInCalendarWeeks, subDays 
} from 'date-fns'
import { useColorScale } from '@/hooks/useColorScale'

const Heatmap = () => {
  const { heatmapData } = useColorScale()
  const scrollViewRef = useRef<ScrollView>(null)

  const boxSize = 18
  const margin = 4
  const cellWidth = boxSize + margin
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const now = new Date()
  const startYear = startOfYear(now)
  const firstSunday = getDay(startYear) === 0 ? startYear : subDays(startYear, getDay(startYear))
  const endYear = endOfYear(now)
  const days = eachDayOfInterval({ start: startYear, end: endYear })

  const cellData = days.map(date => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    const entry = heatmapData.find((item: any) => item.date === formattedDate)
    return {
      date,
      count: entry ? entry.count : 0,
      color: entry ? entry.color : '#eeeeee'
    }
  })

  // 各月の初日位置を計算
  const months = monthNames.map((name, idx) => {
    const firstOfMonth = startOfMonth(new Date(now.getFullYear(), idx, 1))
    const weekIndex = differenceInCalendarWeeks(firstOfMonth, firstSunday, { weekStartsOn: 0 })
    return { name, x: weekIndex * cellWidth }
  })

  const totalWeeks = differenceInCalendarWeeks(endYear, firstSunday, { weekStartsOn: 0 }) + 1
  const svgWidth = totalWeeks * cellWidth
  const svgHeight = 20 + 7 * cellWidth // 20px分は月ラベル用

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const todayWeekIndex = differenceInCalendarWeeks(new Date(), firstSunday, { weekStartsOn: 0})
      const screenWidth = Dimensions.get('window').width
      const offset = todayWeekIndex * cellWidth - (screenWidth / 2 - boxSize / 2)
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: offset, animated: true })
      }
    })

  }, [days])

  return (
    <View style={{ flexDirection: 'row', padding: 10 }}>
      {/* 曜日ラベル */}
      <View style={{ marginRight: 5 }}>
          <View style={{ height: 20 }} />
          {weekdays.map(day => (
            <View key={day} style={{ height: cellWidth, justifyContent: 'center' }}>
              <Text style={{ fontSize: 10, textAlign: 'right' }}>{day}</Text>
            </View>
          ))}
        </View>
      <ScrollView horizontal ref={scrollViewRef}>
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
          {cellData.map(d => {
            const weekIndex = differenceInCalendarWeeks(d.date, firstSunday, { weekStartsOn: 0 })
            const dayIndex = getDay(d.date)
            const x = weekIndex * cellWidth
            const y = dayIndex * cellWidth + 20
            const isToday = format(d.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            
            return (
              <React.Fragment key={format(d.date, 'yyyy-MM-dd')}>
                <Rect
                  x={x}
                  y={y}
                  width={boxSize}
                  height={boxSize}
                  fill={d.color}
                  rx={3}
                  stroke={isToday ? "black" : undefined}
                  strokeWidth={isToday ? 2 : 0}
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
      </ScrollView>
    </View>
  )
}

export default Heatmap
