// ref: https://bl.ocks.org/tompiler/6045b80d2164077faaf96e0304531bba
// ref: https://observablehq.com/@d3/candlestick-chart
// ref: https://github.com/rrag/react-stockcharts-examples2
// spec target: https://candlestick-chart.vercel.app/
import type { NextPage } from 'next'
import { useEffect } from 'react'
import useSWRImmutable from 'swr/immutable'
import * as d3 from 'd3'
import { fetcher } from '../libs/fetcher'

const Home: NextPage = () => {
  /*
  const { data } = useSWRImmutable(
    'https://alpha-vantage.p.rapidapi.com/query?interval=5min&function=TIME_SERIES_INTRADAY&symbol=MSFT&datatype=json&output_size=compact',
    fetcher
  )*/
  const { data } = useSWRImmutable('/mock.json', fetcher)

  const timeSeries = data?.['Time Series (5min)']

  /**
   * 1. open: "299.3799"
2. high: "300.2500"
3. low: "299.3700"
4. close: "300.1700"
5. volume: "487028"
   */
  useEffect(() => {
    if (timeSeries) {
      d3.json('/mock.json').then((data: any) => {
        // get data
        const dataSource = data['Time Series (5min)']
        const series = Object.entries(dataSource).map(
          ([key, value], index) => ({
            key: index + 1,
            open: Number(value['1. open']),
            high: Number(value['2. high']),
            low: Number(value['3. low']),
            close: Number(value['4. close']),
            volume: Number(value['5. volume']),
          })
        )
        console.log('series', series)

        // draw area init
        const margin = { top: 15, right: 65, bottom: 205, left: 50 },
          w = 1000 - margin.left - margin.right,
          h = 625 - margin.top - margin.bottom

        const svg = d3
          .select('#container')
          .attr('width', w + margin.left + margin.right)
          .attr('height', h + margin.top + margin.bottom)
          .append('g')
          .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
          )

        // 計算x
        const xScale = d3
          .scaleLinear()
          .domain([-1, series.length])
          .range([0, w])
        const xDateScale = d3.scaleQuantize().domain([0, series.length]).range()

        const xBand = d3
          .scaleBand()
          .domain(d3.range(-1, series.length))
          .range([0, w])
          .padding(0.3)
        const xAxis = d3.axisBottom(xScale)

        svg
          .append('rect')
          .attr('id', 'rect')
          .attr('width', w)
          .attr('height', h)
          .style('fill', 'none')
          .style('pointer-events', 'all')
          .attr('clip-path', 'url(#clip)')

        // 計算y
        const ymin = d3.min(series.map((r) => r.low))
        const ymax = d3.max(series.map((r) => r.high))
        const yScale = d3
          .scaleLinear()
          .domain([ymin, ymax])
          .range([h, 0])
          .nice()
        // 畫圖表

        var chartBody = svg
          .append('g')
          .attr('class', 'chartBody')
          .attr('clip-path', 'url(#clip)')

        const gX = svg
          .append('g')
          .attr('class', 'axis x-axis') //Assign "axis" class
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis)

        // draw rectangles
        let candles = chartBody
          .selectAll('.candle')
          .data(series)
          .enter()
          .append('rect')
          .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
          .attr('class', 'candle')
          .attr('y', (d) => yScale(Math.max(d.open, d.close)))
          .attr('width', xBand.bandwidth())
          .attr('height', (d) =>
            d.open === d.close
              ? 1
              : yScale(Math.min(d.open, d.close)) -
                yScale(Math.max(d.open, d.close))
          )
          .attr('fill', (d) =>
            d.open === d.close ? 'silver' : d.open > d.close ? 'red' : 'green'
          )

        // draw high and low
        let stems = chartBody
          .selectAll('g.line')
          .data(series)
          .enter()
          .append('line')
          .attr('class', 'stem')
          .attr('x1', (d, i) => xScale(i) - xBand.bandwidth() / 2)
          .attr('x2', (d, i) => xScale(i) - xBand.bandwidth() / 2)
          .attr('y1', (d) => yScale(d.high))
          .attr('y2', (d) => yScale(d.low))
          .attr('stroke', (d) =>
            d.open === d.close ? 'white' : d.open > d.close ? 'red' : 'green'
          )

        svg
          .append('defs')
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', w)
          .attr('height', h)

        const extent = [
          [0, 0],
          [w, h],
        ]
      })
    }
  }, [timeSeries])
  return <div id="container" />
}

export default Home
