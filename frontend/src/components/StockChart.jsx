import React from 'react';

import PropTypes from 'prop-types';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { Chart, ChartCanvas } from 'react-stockcharts';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import {
  CrossHairCursor,
  CurrentCoordinate,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { ema, sma } from 'react-stockcharts/lib/indicator';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import {
  AreaSeries,
  BarSeries,
  LineSeries,
} from 'react-stockcharts/lib/series';
import {
  OHLCTooltip,
  MovingAverageTooltip,
} from 'react-stockcharts/lib/tooltip';
import {
  createVerticalLinearGradient,
  hexToRGBA,
  last,
} from 'react-stockcharts/lib/utils';

const canvasGradient = createVerticalLinearGradient([
  { stop: 0, color: hexToRGBA('#b5d0ff', 0.2) },
  { stop: 0.5, color: hexToRGBA('#6fa4fc', 0.4) },
  { stop: 1, color: hexToRGBA('#4286f4', 0.8) },
]);

class StockChart extends React.Component {
  render() {
    const sma50 = sma()
      .options({ windowSize: 50 })
      .stroke('#6ba583')
      .merge((d, c) => {
        d.sma50 = c;
      })
      .accessor((d) => d.sma50);

    const ema50 = ema()
      .options({ windowSize: 50 })
      .stroke('#ff0000')
      .merge((d, c) => {
        d.ema50 = c;
      })
      .accessor((d) => d.ema50);

    const { type, data: initialData, width, ratio } = this.props;

    const calculatedData = sma50(ema50(initialData));
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => d.date
    );
    const { data, xScale, xAccessor, displayXAccessor } =
      xScaleProvider(calculatedData);

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];

    return (
      <ChartCanvas
        height={400}
        width={width}
        ratio={ratio}
        margin={{ left: 70, right: 70, top: 10, bottom: 30 }}
        type={type}
        seriesName="StockChart"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={1}
          yExtents={[
            (d) => [d.high, d.low],
            sma50.accessor(),
            ema50.accessor(),
          ]}
        >
          <XAxis axisAt="bottom" orient="bottom" ticks={width / 100} />
          <YAxis axisAt="right" orient="right" ticks={5} />

          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.2f')}
          />

          <AreaSeries
            yAccessor={(d) => d.close}
            strokeWidth={2}
            canvasGradient={canvasGradient}
          />

          <CurrentCoordinate yAccessor={(d) => d.close} fill={'#1f77b4'} />

          <LineSeries
            yAccessor={sma50.accessor()}
            stroke={sma50.stroke()}
            highlightOnHover
          />
          <LineSeries
            yAccessor={ema50.accessor()}
            stroke={ema50.stroke()}
            highlightOnHover
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.close}
            fill={(d) => (d.close > d.open ? '#6ba583' : '#ff0000')}
          />

          <OHLCTooltip origin={[-40, 0]} />
          <MovingAverageTooltip
            origin={[-38, 15]}
            options={[
              {
                yAccessor: sma50.accessor(),
                type: 'SMA',
                stroke: sma50.stroke(),
                windowSize: sma50.options().windowSize,
              },
              {
                yAccessor: ema50.accessor(),
                type: 'EMA',
                stroke: ema50.stroke(),
                windowSize: ema50.options().windowSize,
              },
            ]}
          />
        </Chart>
        <Chart
          id={2}
          yExtents={[(d) => d.volume]}
          height={150}
          origin={(w, h) => [0, h - 150]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format('.2s')}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%Y-%m-%d')}
          />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format('.4s')}
          />

          <BarSeries
            yAccessor={(d) => d.volume}
            fill={(d) => (d.close > d.open ? '#6ba583' : '#ff0000')}
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.volume}
            fill="#0f0f0f"
            displayFormat={format('.2s')}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

StockChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

StockChart.defaultProps = {
  type: 'hybrid',
};
StockChart = fitWidth(StockChart);

export default StockChart;
