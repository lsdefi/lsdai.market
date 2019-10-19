import BigNumber from 'bignumber.js';
import Gun from 'gun/gun';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';
import React from 'react';

class RateHistory extends React.Component {
  constructor(props) {
    super(props);

    this.apiUrl = 'https://api.compound.finance/api/v2';
    this.asset = '0xf5dce57282a584d2746faf1593d3121fcac444dc';
    this.cToken = 'ctoken';
    this.interval = 60 * 60 * 24;
    this.marketHistory = 'market_history/graph';
    this.max = Math.round((new Date()).valueOf() / 1000);
    this.days = 22 * 7;
    this.min = this.max - this.interval * this.days;

    this.state = {
      rateChange: 0,
      supplyRate: 0,
    };

    this.updateHistoricalRates = this.updateHistoricalRates.bind(this);
    this.updateSupplyRate = this.updateSupplyRate.bind(this);
  }

  componentDidMount() {
    const { gun } = this.props;

    gun.get('historicalRates').on(this.updateHistoricalRates);
    gun.get('supplyRate').on(this.updateSupplyRate);

    this.fetchCompoundData();
    this.pid = setInterval(() => this.fetchCompoundData(), 15000);
  }

  componentWillUnmount() {
    clearInterval(this.pid);
  }

  async fetchCompoundData() {
    const {
      apiUrl,
      asset,
      cToken,
      marketHistory,
      max,
      min,
      days,
    } = this;

    const responses = await Promise.all([
      fetch(`${apiUrl}/${marketHistory}?asset=${asset}&min_block_timestamp=${min}&max_block_timestamp=${max}&num_buckets=${days}`),
      fetch(`${apiUrl}/${cToken}?addresses[]=${asset}`),
    ]);

    try {
      const rateData = await responses[0].json();
      const cTokenData = await responses[1].json();
      const exchangeRate = cTokenData.cToken[0].exchange_rate.value;
      const supplyRate = cTokenData.cToken[0].supply_rate.value;

      const { gun } = this.props;

      const historicalRates = {};
      rateData.supply_rates.forEach(({ rate }, index) => {
        historicalRates[index] = BigNumber(rate).multipliedBy(100).dp(2).toNumber();
      });

      gun.get('exchangeRate').put({ rate: exchangeRate });
      gun.get('historicalRates').put(historicalRates);
      gun.get('supplyRate').put({
        rate: BigNumber(supplyRate).multipliedBy(100).dp(2).toNumber(),
      });
    } catch (e) {
      setTimeout(() => this.fetchCompoundData(), 1000);
    }
  }

  updateHistoricalRates(rates) {
    const data = [];
    const { interval, min, days } = this;
    let i = 0;

    for (; i < days; i += 1) {
      data.push(rates[i]);
    }

    if (this.chart) {
      this.chart.update({ series: [{ data }] });
      return;
    }

    const pointInterval = interval * 1000;
    const pointStart = new Date(min * 1000).valueOf();

    this.chart = Highcharts.chart('rate-history', {
      chart: {
        height: '220',
        width: '434',
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
              lineWidth: 4,
            },
          },
        },
      },
      series: [{ data, type: 'spline' }],
      title: { text: '' },
      legend: { enabled: false },
      xAxis: {
        type: 'datetime',
        lineColor: '#4a4a4a',
        lineWidth: 1
      },
      yAxis: {
        max: 16,
        lineColor: '#4a4a4a',
        gridLineColor: '#4a4a4a',
        tickColor: '#4a4a4a',
        title: { enabled: false },
        labels: {
          formatter: function formatter() {
            return `${this.value}%`;
          },
        },
      },
    });
  }

  updateSupplyRate({ rate }) {
    const { gun } = this.props;
    const { days } = this;

    gun.get('historicalRates').once((rates) => {
      const last = rates[days - 1] || rate;
      const rateChange = BigNumber(rate).minus(last).toNumber();

      this.setState({ rateChange, supplyRate: rate });
    });
  }

  render() {
    const { rateChange, supplyRate } = this.state;
    let rateChangeArrowClass = 'far fa-angle-up';
    let rateChangeClass = 'text-green text-base';
    let rateChangeValue = rateChange;

    if (rateChange < 0) {
      rateChangeArrowClass = 'far fa-angle-down';
      rateChangeClass = 'text-red text-base';
      rateChangeValue = 1 - rateChangeValue;
    }

    return (
      <div className="chart-container">
        <div>
          <div className="chart-title">
            <span>
              {supplyRate}
              %
            </span>
            <span className={rateChangeClass}>
              <i className={rateChangeArrowClass} />
              {rateChangeValue}
            </span>
            <br />
            <span className="text-white text-lg leading-none">
              DAI Lending Rate
              <br />
              on Compound.finance
            </span>
          </div>
          <div id="rate-history" />
          <div className="subtitle">
            Get High on Interest
          </div>
      </div>
      </div>
    );
  }
}

RateHistory.propTypes = {
  gun: PropTypes.instanceOf(Gun).isRequired,
};

export default RateHistory;
