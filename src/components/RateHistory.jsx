import BigNumber from 'bignumber.js';
import Highcharts from 'highcharts';
import React from 'react';
// import strftime from 'strftime';

class RateHistory extends React.Component {
  constructor() {
    super();

    this.apiUrl = 'https://api.compound.finance/api/v2';
    this.asset = '0xf5dce57282a584d2746faf1593d3121fcac444dc';
    this.cToken = 'ctoken';
    this.historicalRates = [];
    this.marketHistory = 'market_history/graph';
    this.weeks = 20;

    this.state = {
      supplyRate: 0,
    };
  }

  async componentDidMount() {
    const {
      apiUrl,
      asset,
      cToken,
      marketHistory,
      weeks,
    } = this;
    const interval = 60 * 60 * 24 * 7;
    const max = Math.round((new Date()).valueOf() / 1000);
    const min = max - interval * weeks;
    const pointInterval = interval * 1000;
    const pointStart = new Date(min * 1000).valueOf();

    const responses = await Promise.all([
      fetch(`${apiUrl}/${marketHistory}?asset=${asset}&min_block_timestamp=${min}&max_block_timestamp=${max}&num_buckets=${weeks}`),
      fetch(`${apiUrl}/${cToken}?addresses[]=${asset}`),
    ]);

    const rateData = await responses[0].json();
    const cTokenData = await responses[1].json();

    this.historicalRates = rateData.supply_rates.map(({ rate }) => (rate * 100));

    const supplyRate = cTokenData.cToken[0].supply_rate.value;

    this.setState({
      supplyRate: BigNumber(supplyRate).multipliedBy(100).dp(2).toNumber(),
    });

    this.chart = Highcharts.chart('rate-history', {
      chart: { type: 'line' },
      plotOptions: { series: { pointInterval, pointStart } },
      series: [{ data: this.historicalRates }],
      title: { text: 'DAI Lending Rate on Compound Finance' },
      // xAxis: { labels: { formatter } },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Lending Rate' } },
    });
  }

  render() {
    const { supplyRate } = this.state;

    return (
      <div>
        <span>{ supplyRate }</span>
        <div id="rate-history" />
      </div>
    );
  }
}

export default RateHistory;
