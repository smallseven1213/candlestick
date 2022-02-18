// ref: https://bl.ocks.org/tompiler/6045b80d2164077faaf96e0304531bba
// ref: https://observablehq.com/@d3/candlestick-chart
// ref: https://github.com/rrag/react-stockcharts-examples2
// ref: https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b
// spec target: https://candlestick-chart.vercel.app/
import type { NextPage } from 'next'
import { HomeContextProvider } from '../components/pages/home/contexts/home.provider'
import AppBar from '@/components/pages/home/components/AppBar'
import CandleStickChart from '@/components/pages/home/components/CandleStickChart'

const Home: NextPage = () => {
  return (
    <HomeContextProvider>
      <div className="flex flex-col h-screen">
        <AppBar />
        <CandleStickChart />
      </div>
    </HomeContextProvider>
  )
}

export default Home
