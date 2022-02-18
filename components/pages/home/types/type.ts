export interface TimeSeries {
  [key: string]: {
    '1. open': string
    '2. high': string
    '3. low': string
    '4. close': string
    '5. volume': string
  }
}

export interface APIResponse {
  'Time Series (5min)': TimeSeries
}

export interface SWRResponseData {
  series: {
    open: number
    high: number
    low: number
    close: number
    volume: number
  }[]
  statistics: {
    priceLow: number
    priceHigh: number
    volumeLow: number
    volumeHigh: number
  }
}
