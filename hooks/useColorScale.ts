import { useDatabase } from './useDatabase'
import { useEffect, useState } from 'react'
import { aggregateTaskLogs } from '@/database/queries'
import { eventEmitter } from '@/lib/EventEmitter'

export const useColorScale = () => {
  const { db } = useDatabase()
  const [heatmapData, setHeatmapData] = useState<any>([])

  const getColor = (recordCount: number) => {
    if (recordCount >= 4) return '#6098C8'   // 明るめのパステルブルー（濃いめ）
    else if (recordCount === 3) return '#8EB8E0'  // 明るめのパステルブルー（中間）
    else if (recordCount === 2) return '#B7D4EE'  // 淡いパステルブルー
    else if (recordCount === 1) return '#DCEBFA'  // 非常に淡いパステルブルー
    else return '#F0F4F9'                         // デフォルトの淡いグレー
  }

  const fetchHeatmapData = async () => {
    try {
      const result = await aggregateTaskLogs(db) as { date: string, record_count: number }[]
      if (!result || result.length === 0) return
      // 結果を辞書型に変換
      const aggregatedObj: Record<string, number> = result.reduce((acc: any, log:any) => {
        acc[log.date] = log.record_count
        return acc
      }, {})

      const heatmapDataArr = Object.keys(aggregatedObj).map(date => {
        const count = aggregatedObj[date]
        const color = getColor(count)
        return { date, count, color}
      })
      setHeatmapData(heatmapDataArr)
      
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log('useColorScale: 更新')
    if (db) {
      fetchHeatmapData()
      eventEmitter.addListener('taskUpdated', fetchHeatmapData)
      return () => {
        eventEmitter.removeListener('taskUpdated', fetchHeatmapData)
      }
    }
  }, [db])

  return { heatmapData }

}