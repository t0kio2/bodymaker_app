import { scaleLinear } from 'd3-scale'
import { useDatabase } from './useDatabase'
import { useEffect, useState } from 'react'
import { aggregateTaskLogs } from '@/database/queries'
import { AggregatedLog } from '@/types'

export const useColorScale = () => {
  const { db } = useDatabase()
  const [aggregated, setAggregated] = useState<AggregatedLog>({})
  const [heatMapData, setHeatMapData] = useState({})

  useEffect(() => {
    if (db) {
      (async () => {
        try {
          const aggregateTaskLogsObj: AggregatedLog = {}
          const result = await aggregateTaskLogs(db) as { date: string, record_count: number }[]
          if (!result) return
          result.forEach((log) => {
            aggregateTaskLogsObj[log.date] = log.record_count
          })
          setAggregated(aggregateTaskLogsObj)
          
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [db])

  return { heatMapData }

}