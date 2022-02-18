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
