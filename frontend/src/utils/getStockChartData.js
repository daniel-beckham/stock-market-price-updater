import { timeParse } from 'd3-time-format';
import getJsonData from './getJsonData';

export default function getStockChartData(symbol) {
  const result = getJsonData('/stock-data/' + symbol)
    .then(response => {
      let chartArray = [];

      response.data.forEach(responseObject => {
        let chartObject = {};

        chartObject.date = timeParse('%Y-%m-%d')(responseObject.date);
        chartObject.open = +responseObject.open;
        chartObject.high = +responseObject.high;
        chartObject.low = +responseObject.low;
        chartObject.close = +responseObject.close;
        chartObject.volume = +responseObject.volume;
        chartArray.push(chartObject);
      });

      return chartArray.reverse();
    })
    .catch(error => {
      return [];
    });

  return result;
}
