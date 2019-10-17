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
      chart: {
        height: '300',
        type: 'line',
        backgroundColor: '#0b0b0b',
      },
      plotOptions: {
        series: {
          pointInterval,
          pointStart,
          color: '#e8c538',
          lineWidth: 3,
          states: {
              hover: {
                  enabled: true,
                  lineWidth: 4
              }
          }
        }
      },
      series:
        [{
          data: this.historicalRates,
          type: 'spline',
        }],
      title: { text: '' },
      legend: {
        enabled: false
      },
      // xAxis: { labels: { formatter } },
      xAxis: { type: 'datetime' },
      yAxis: {
        max: 16,
        gridLineColor: "#7a7a7a",
        title: {enabled:false},
        labels: {
          formatter: function() {
            return this.value + '%';
          }
        }
      },
    });
    console.log(this.chart);
  }

  render() {
    const { supplyRate } = this.state;

    return (
      <div className="chart-container">
        <div className="chart-title">
          <span className="text-5xl">{ supplyRate }</span><span className="text-red text-2xl">▼ 0.33%</span>
          <br /><span className="text-white text-3xl leading-none">DAI Lending Rate<br />on Compound.finance</span>
        </div>
        <div id="rate-history" />
        <div className="subtitle">
          Get High on Interest
        </div>
      </div>
    );
  }
}

export default RateHistory;
