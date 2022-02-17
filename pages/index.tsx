// ref: https://bl.ocks.org/tompiler/6045b80d2164077faaf96e0304531bba
// ref: https://observablehq.com/@d3/candlestick-chart
// ref: https://github.com/rrag/react-stockcharts-examples2
// ref: https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b
// spec target: https://candlestick-chart.vercel.app/
import type { NextPage } from 'next'
import type { D3ZoomEvent } from 'd3'
import { useEffect, useState } from 'react'
import * as d3 from 'd3'

type TimeSeries = {
  [key: string]: {
    '1. open': string
    '2. high': string
    '3. low': string
    '4. close': string
    '5. volume': string
  }
}

type ResponseData = {
  'Time Series (5min)': TimeSeries
}

const lineColorParser = (open: number, close: number) =>
  open === close ? 'silver' : open > close ? 'red' : 'green'

const Home: NextPage = () => {
  const [stockCode, setStockCode] = useState('MSFT')

  useEffect(() => {
    d3.json(
      `https://alpha-vantage.p.rapidapi.com/query?interval=5min&function=TIME_SERIES_INTRADAY&symbol=${stockCode}&datatype=json&output_size=compact`,
      {
        headers: new Headers({
          'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
          'x-rapidapi-key':
            'b1ce7d6ccdmsh2c20195f3dde848p1750d9jsn420336a43a7a',
        }),
      }
    ).then((data: any) => {
      // get data
      const dataSource = data['Time Series (5min)'] as TimeSeries
      const series = Object.values(dataSource).map((value, index) => ({
        key: index + 1,
        open: Number(value['1. open']),
        high: Number(value['2. high']),
        low: Number(value['3. low']),
        close: Number(value['4. close']),
        volume: Number(value['5. volume']),
      }))

      // draw area init
      const margin = { top: 15, right: 65, bottom: 205, left: 50 },
        w = 1000 - margin.left - margin.right,
        h = 625 - margin.top - margin.bottom

      const svg = d3
        .select('#container')
        .attr('width', w + margin.left + margin.right)
        .attr('height', h + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // 計算x
      const xScale = d3
        .scaleLinear()
        .domain([-40, series.length + 40])
        .range([0, w])
      // const xDateScale = d3.scaleQuantize().domain([0, series.length]).range()

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

      // 計算y: candlestick
      const ymin = d3.min(series.map((r) => r.low)) as number
      const ymax = d3.max(series.map((r) => r.high)) as number
      const yScale = d3
        .scaleLinear()
        .domain([ymin - 5, ymax + 5])
        .range([h, 0])
        .nice()
      const yAxis = d3.axisLeft(yScale)
      const gY = svg.append('g').attr('class', 'axis y-axis').call(yAxis)

      // 計算y: volumn
      const Y_VOLUMN_MAX = d3.max(series.map((r) => r.volume)) as number
      const yVolumnScale = d3
        .scaleLinear()
        .domain([0, Y_VOLUMN_MAX])
        .range([0, 100])
        .nice()
      const yVolumnAxis = d3.axisLeft(yVolumnScale)
      const gVolumnY = svg
        .append('g')
        .attr('class', 'axis y-axis')
        .attr('transform', 'translate(0,' + (h - 100) + ')')
        .call(yVolumnAxis)

      // 畫圖表
      var chartBody = svg
        .append('g')
        .attr('class', 'chartBody')
        .attr('clip-path', 'url(#clip)')

      const gX = svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + h + ')')
        .attr(
          'viewBox',
          '0 0 ' +
            (w + margin.left + margin.right) +
            ' ' +
            (h + margin.top + margin.bottom)
        )
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
        .attr('fill', (d) => lineColorParser(d.open, d.close))

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
        .attr('stroke', (d) => lineColorParser(d.open, d.close))

      // volumns
      let volumns = chartBody
        .selectAll('.volumn')
        .data(series)
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
        .attr('class', 'volumn')
        .attr('y', (d) => h - yVolumnScale(d.volume))
        .attr('width', xBand.bandwidth() / 3)
        .attr('height', (d) => yVolumnScale(d.volume))
        .attr('fill', (d) => lineColorParser(d.open, d.close))

      svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', w)
        .attr('height', h)

      // zoom event
      const extent: [[number, number], [number, number]] = [
        [0, 0],
        [w, h],
      ]

      const zoomed = (event: D3ZoomEvent<HTMLCanvasElement, any>) => {
        const t = event.transform
        let xScaleZ = t.rescaleX(xScale)

        // d3.selectAll('.xAxis .tick text').style('display', 'none')

        candles
          .attr('x', (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr('width', xBand.bandwidth() * t.k)
        volumns
          .attr('x', (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr('width', (xBand.bandwidth() * t.k) / 3)
        stems.attr(
          'x1',
          (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
        )
        stems.attr(
          'x2',
          (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
        )

        gX.call(d3.axisBottom(xScaleZ))
      }

      const zoom = d3
        .zoom()
        .scaleExtent([1, 100])
        .translateExtent(extent)
        .extent(extent)
        .on('zoom', zoomed)
      // .on('zoom.end', zoomend)

      svg.call(zoom as any)
    })
  }, [stockCode])

  return <svg id="container" />
}

export default Home
