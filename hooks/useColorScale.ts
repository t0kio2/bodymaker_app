import { scaleLinear } from 'd3-scale'
import { useDatabase } from './useDatabase'
import { useEffect, useState } from 'react'
import { aggregateTaskLogs } from '@/database/queries'
import { AggregatedLog } from '@/types'

export const useColorScale = () => {
  const { db } = useDatabase()
  const [heatmapData, setHeatmapData] = useState<any>([])

  useEffect(() => {
    if (db) {
      (async () => {
        try {
          const result = await aggregateTaskLogs(db) as { date: string, record_count: number }[]
          if (!result || result.length === 0) return
          // 結果を辞書型に変換
          const aggregatedObj: Record<string, number> = result.reduce((acc: any, log:any) => {
            acc[log.date] = log.record_count
            return acc
          }, {})

          const maxCount = Math.max(...Object.values(aggregatedObj))
          const colorScale = scaleLinear<string>().domain([0, maxCount]).range(['#eeeeee', '#3b82f6'])

          const heatmapDataArr = Object.keys(aggregatedObj).map(date => {
            const count = aggregatedObj[date]
            const color = colorScale(count)
            return { date, count, color}
          })
          setHeatmapData(heatmapDataArr)
          
        } catch (error) {
          console.error(error)
        }

      })()
    }
  }, [db])

  return { heatmapData }

}