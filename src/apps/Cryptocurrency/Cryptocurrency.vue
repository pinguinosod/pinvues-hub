<template>
  <div>
    <h2>Cryptocurrency!</h2>
    <div class="alert alert-info">
      Data taken from
      <a href="https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md">
        https://api.binance.com
      </a>
    </div>
    <transition name="fade">
      <div v-if="cryptoData.length == 0" class="row" key="loading">
        <div class="col"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
      </div>
      <div v-else class="row" key="content">
        <div class="col-md-6 col-lg-4">
          <div class="mt-4">
            <ul class="nav nav-pills">
              <li class="nav-item" v-for="quoteAsset in quoteAssets">
                <a  class="nav-link"
                    :class="{'active': quoteAsset == quoteAssetFilter}"
                    href="#"
                    @click="selectQuoteAsset($event,quoteAsset)">{{ quoteAsset }}</a>
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <input type="text"
                   placeholder="Search..."
                   v-model="symbolFilter"
                   class="form-control">
          </div>
          <div class="mt-4">Pair:
            <ul id="symbolList">
              <li v-for="crypto in cryptoDataFiltered"
                  :class="{'active': selectedSymbol == crypto.symbol}"
                  @click="selectedSymbol = crypto.symbol">
                {{ crypto.symbol }}
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-6 col-lg-8 mt-4">
          <transition name="fade">
            <div v-if="!selectedSymbol" class="alert alert-info" key="noSymbol">Please select a pair.</div>
            <div v-else key="gotSymbol" id="candleChartContainer">
              <transition name="fade">
                <div v-if="loadingCandles" key="loadingCandles">
                  <i class="fas fa-spinner fa-spin"></i> LOADING CANDLES!!11
                </div>
                <div v-else key="candlesLoaded">
                  <h5>{{ selectedSymbol }}</h5>
                  <span> [24h]
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
              </transition>
            </div>
          </transition>
        </div>
      </div>
    </transition>
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
      return candle[1] > candle[4] ? 'red' : 'green';
    },
    getCandleTopPosition: function(high) {
      return ( (this.candlesHighest - high) / (this.candlesHighest - this.candlesLowest) ) * 100;
    },
    higher: function(a,b) {
      return a > b ? a : b;
    },
    lower: function(a,b) {
      return a < b ? a : b;
    },
    selectQuoteAsset: function(event,quoteAsset) {
      event.preventDefault();
      if (quoteAsset == this.quoteAssetFilter) {
        this.quoteAssetFilter = '';
      }
      else {
        this.quoteAssetFilter = quoteAsset;
      }
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

<style lang="scss" scoped>
  @import "../../styles/settings.scss";
  @import "../../styles/animations.scss";

  #symbolList {
    height: 210px;
    overflow-y: auto;
    padding:0px;
  }

  #symbolList li {
    cursor: pointer;
    list-style-type: none;
  }

  #symbolList li.active {
    background-color: $primary-color;
    color: $alternative-text-color;
  }

  #candleChartContainer {
    min-height:380px;
  }

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
