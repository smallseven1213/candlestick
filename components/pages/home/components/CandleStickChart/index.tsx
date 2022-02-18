import type { D3ZoomEvent } from 'd3'
import { useEffect, useContext } from 'react'
import * as d3 from 'd3'
import { useWindowSize } from 'react-use'
import useSWRImuutable from 'swr/immutable'
import { fetcher } from '@/libs/fetcher'
import { HomeContext } from '../../contexts/home.provider'
import type { APIResponse, SWRResponseData, TimeSeries } from '../../types/type'
import { chartGenerator } from '../../libs/chartGenerator'

const CandleStickChart = () => {
  const { stockCode } = useContext(HomeContext)
  const { width, height } = useWindowSize()

  const { data } = useSWRImuutable<SWRResponseData>(
    ['/mock.json', stockCode],
    // `https://alpha-vantage.p.rapidapi.com/query?interval=5min&function=TIME_SERIES_INTRADAY&symbol=${stockCode}&datatype=json&output_size=compact`,
    async (url): Promise<SWRResponseData> => {
      const res = await fetcher<APIResponse>(url)
      const dataSource = res['Time Series (5min)'] as TimeSeries
      const series = Object.values(dataSource).map((value, index) => ({
        key: index + 1,
        open: Number(value['1. open']),
        high: Number(value['2. high']),
        low: Number(value['3. low']),
        close: Number(value['4. close']),
        volume: Number(value['5. volume']),
      }))

      const volumeArr = series.map((s) => s.volume)

      return {
        series,
        statistics: {
          priceLow: d3.min(series.map((s) => s.low)) as number,
          priceHigh: d3.max(series.map((s) => s.high)) as number,
          volumeLow: d3.min(volumeArr) as number,
          volumeHigh: d3.max(volumeArr) as number,
        },
      }
    }
  )

  useEffect(() => {
    if (data) {
      chartGenerator('#container', width, height, data)
    }
  }, [data, width, height])

  return (
    <div className="flex-1 justify-center items-center overflow-hidden place-items-center">
      <svg
        id="container"
        preserveAspectRatio="xMidYMid meet"
        className="place-items-center"
      />
    </div>
  )
}

export default CandleStickChart
