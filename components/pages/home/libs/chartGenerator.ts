import type { D3ZoomEvent } from 'd3'
import * as d3 from 'd3'
import numeral from 'numeral'
import { SWRResponseData } from '../types/type'
import { lineColorParser } from '../libs/lineColorParser'

const MARGIN = { TOP: 15, RIGHT: 65, BOTTOM: 205, LEFT: 50 }

export const chartGenerator = (
  targetId: string,
  width: number,
  height: number,
  data: SWRResponseData
) => {
  try {
    const targetDom = document.querySelector(targetId)
    if (targetDom) {
      targetDom.innerHTML = ''
    }
    const container = d3
      .select(targetId)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .classed('svg-content-responsive', true)
      .attr('transform', 'translate(' + MARGIN.LEFT + ',' + MARGIN.TOP + ')')

    const w = width - MARGIN.LEFT - MARGIN.RIGHT,
      h = height - MARGIN.TOP - MARGIN.BOTTOM

    // 計算x
    const xScale = d3
      .scaleLinear()
      .domain([-40, data.series.length + 40])
      .range([0, w])

    const xBand = d3
      .scaleBand<number>()
      .domain(d3.range(-1, data.series.length))
      .range([0, w])
      .padding(0.6)
    const xAxis = d3.axisBottom(xScale)

    container
      .append('rect')
      .attr('id', 'rect')
      .attr('width', w)
      .attr('height', h)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('clip-path', 'url(#clip)')

    // 計算y: candlestick
    const yScale = d3
      .scaleLinear()
      .domain([data.statistics.priceLow - 5, data.statistics.priceHigh + 5])
      .range([h, 0])
      .nice()
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `$${d}`)
    container.append('g').attr('class', 'axis y-axis').call(yAxis)

    // 計算y: volume
    const yVolumeScale = d3
      .scaleLinear()
      .domain([data.statistics.volumeLow, data.statistics.volumeHigh])
      .range([0, 100])
      .nice()
    const yVolumeAxis = d3
      .axisLeft(yVolumeScale)
      .tickFormat((d) => numeral(d).format('0.0 a'))
    container
      .append('g')
      .attr('class', 'axis y-axis volume-y-axis')
      .attr('transform', 'translate(0,' + (h - 100) + ')')
      .call(yVolumeAxis)
    d3.selectAll('.volume-y-axis .tick line').attr(
      'transform',
      'translate(6,0)'
    )
    d3.selectAll('.volume-y-axis .tick text')
      .attr('x', 10)
      .style('text-anchor', 'start')

    // 畫圖表
    var chartBody = container
      .append('g')
      .attr('class', 'chartBody')
      .attr('clip-path', 'url(#clip)')

    const gX = container
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + h + ')')
      .attr('viewBox', '0 0 ' + w + ' ' + (h + MARGIN.TOP + MARGIN.BOTTOM))
      .call(xAxis)

    // draw rectangles
    let candles = chartBody
      .selectAll('.candle')
      .data(data.series)
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
      .data(data.series)
      .enter()
      .append('line')
      .attr('class', 'stem')
      .attr('x1', (d, i) => xScale(i) - xBand.bandwidth() / 2)
      .attr('x2', (d, i) => xScale(i) - xBand.bandwidth() / 2)
      .attr('y1', (d) => yScale(d.high))
      .attr('y2', (d) => yScale(d.low))
      .attr('stroke', (d) => lineColorParser(d.open, d.close))

    // volumes
    let volumes = chartBody
      .selectAll('.volume')
      .data(data.series)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
      .attr('class', 'volume')
      .attr('y', (d) => h - yVolumeScale(d.volume))
      .attr('width', xBand.bandwidth() / 2)
      .attr('height', (d) => yVolumeScale(d.volume))
      .attr('fill', (d) => lineColorParser(d.open, d.close))

    container
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

      candles
        .attr('x', (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
        .attr('width', xBand.bandwidth() * t.k)
      volumes
        .attr('x', (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
        .attr('width', xBand.bandwidth() * t.k)
      stems
        .attr(
          'x1',
          (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
        )
        .attr(
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

    container.call(zoom as any)
  } catch (error) {
    console.debug(error)
    throw error
  }
}
