<template>
  <div>
    <h2>Cryptocurrency!</h2>
    <div class="alert alert-info">
      Data taken from
      <a href="https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md">
        https://api.binance.com
      </a>
    </div>
    <div class="row">
      <div class="col-sm-4 col-md-3 col-lg-2">
        <div class="mt-4">Pair:
          <select name="symbolSelect"
                  class="form-control"
                  v-model="selectedSymbol">
            <option :value="crypto.symbol" v-for="crypto in cryptoDataFiltered">
              {{ crypto.symbol }}
            </option>
          </select>
        </div>
        <div class="mt-4">
          Search Pair: <input type="text"
                         v-model="symbolFilter"
                         class="form-control">
        </div>
        <div class="mt-4">Filter By Market:
          <select name="quoteAssetFilter"
                  class="form-control"
                  v-model="quoteAssetFilter">
            <option value="">All</option>
            <option :value="quoteAsset" v-for="quoteAsset in quoteAssets">
              {{ quoteAsset }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-sm-8 col-md-9 col-lg-10 mt-4">
        <div  v-show="!selectedSymbol" class="alert alert-info">Please select a pair.</div>
        <div v-show="selectedSymbol">
          <h5>{{ selectedSymbol }}</h5>
          <span v-if="loadingCandles">LOADING CANDLES!!11</span>
          <span v-else> [24h]
                        High: {{ candlesHighest }} |
                        Low: {{ candlesLowest }} |
                        Open: {{ candlesOpen }} |
                        Close: {{ candlesClose }}
          </span>
          <div id="candleChart">
            <div v-for="candle in candlesData"
                 class="candle">
              <div class="HighLow"
                   :style="{
                             'height': getCandleHeight(candle[2],candle[3])+'%',
                             'background-color': getCandleColor(candle),
                             'top': getCandleTopPosition(candle[2])+'%'
                            }"></div>
              <div class="OpenClose"
                   :style="{
                             'height': getCandleHeight(higher(candle[4],candle[1]),lower(candle[4],candle[1]))+'%',
                             'background-color': getCandleColor(candle),
                             'top': getCandleTopPosition(higher(candle[4],candle[1]))+'%'
                            }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data: function() {
    return {
      cryptoData: [],
      candlesData: [],
      loadingCandles: false,
      selectedSymbol: '',
      quoteAssetFilter: '',
      symbolFilter: ''
    }
  },
  methods: {
    getCryptos: function() {
      this.$http.get('http://pinguino.sonet.cl/binance-api/getCryptos.php')
      .then(response=> {
        return response.json();
      })
      .then(data => {
        this.cryptoData = data.symbols;
      }, error => {
        // TODO : Handle errors
        this.cryptoData = [];
      })
    },
    getCandles: function(symbol) {
      this.loadingCandles = true;
      this.$http.get('http://pinguino.sonet.cl/binance-api/getCandles.php?symbol='+symbol+'&interval=1h&limit=24')
      .then(response=> {
        return response.json();
      })
      .then(data => {
        this.candlesData = data;
        this.loadingCandles = false;
      }, error => {
        // TODO : Handle errors
        this.candlesData = [];
      })
    },
    addThousandSeparator(value,separator=',') {
      if (!value) return value;
      if (!separator) return value+'';
      if (separator.length != 1) return '';
      if (value.constructor === Array) return '';
      if (separator.constructor === Array) return '';

      value += '';

      if (value.length <= 3) return value;

      let index = value.indexOf(separator);
      if (index >= 1 && index <= 3) {
        return value;
      }
      if (index == -1) index = value.length;
      let newValue = value.slice(0, index-3) + separator + value.slice(index-3, value.length);
      return this.addThousandSeparator(newValue,separator);
    },
    getCandleHeight: function(high,low) {
      return ( (high - low) / (this.candlesHighest - this.candlesLowest) ) * 100;
    },
    getCandleColor: function(candle) {
      return candle[1] - candle[4] > 0 ? 'red' : 'green';
    },
    getCandleTopPosition: function(high) {
      return ( (this.candlesHighest - high) / (this.candlesHighest - this.candlesLowest) ) * 100;
    },
    higher: function(a,b) {
      return a > b ? a : b;
    },
    lower: function(a,b) {
      return a < b ? a : b;
    }
  },
  computed: {
    cryptoDataOrdered: function () {
      return _.orderBy(this.cryptoData, 'symbol')
    },
    quoteAssets: function() {
      let quoteAssetsList = [];
      this.cryptoDataOrdered.map(function(crypto) {
        if (!quoteAssetsList.includes(crypto.quoteAsset)) {
          quoteAssetsList.push(crypto.quoteAsset);
        }
      });
      return quoteAssetsList;
    },
    cryptoDataFiltered: function() {
      return this.cryptoDataOrdered.filter(crypto => {
        return (crypto.quoteAsset == this.quoteAssetFilter || this.quoteAssetFilter == '')
          &&   crypto.symbol.startsWith(this.symbolFilter.toUpperCase());
      });
    },
    candlesHighest: function() {
      let highest = -1;
      this.candlesData.map(function(candle) {
        if (candle[2] > highest) highest = candle[2];
      });
      return highest;
    },
    candlesLowest: function() {
      let lowest = 9999999999;
      this.candlesData.map(function(candle) {
        if (candle[3] < lowest) lowest = candle[3];
      });
      return lowest;
    },
    candlesOpen: function() {
      if (this.candlesData.length > 0) return this.candlesData[0][1];
      else return '';
    },
    candlesClose: function() {
      if (this.candlesData.length > 0) return this.candlesData[this.candlesData.length-1][4];
      else return '';
    }
  },
  watch: {
    selectedSymbol: function(newSymbol,oldSymbol) {
      if (newSymbol) {
        this.getCandles(newSymbol);
      }
    }
  },
  mounted: function() {
    this.getCryptos();
  }
}
</script>

<style scoped>
  #candleChart {
    height: 300px;
  }

  #candleChart .candle {
    width: 3.5%;
    height: 100%;
    display: inline-block;
    text-align: center;
    margin: 0 1px 0 1px;
    position: relative;
  }

  #candleChart .candle .HighLow {
    width: 1px;
    position: absolute;
    left: 40%;
  }

  #candleChart .candle .OpenClose {
    width: 90%;
    position: absolute;
    left: 0;
    min-height: 0.5%;
  }
</style>
