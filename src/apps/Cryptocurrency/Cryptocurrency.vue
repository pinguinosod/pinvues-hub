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
                   class="form-control form-control-sm">
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
              <div class="row">
                <div class="col-3">
                  <h5>{{ selectedSymbol }}</h5>
                </div>
                <div class="col-9">
                  <div class="form-group row">
                    <label class="col-8 col-form-label text-right">Time Interval:</label>
                    <div class="col-4">
                      <select class="form-control form-control-sm" v-model="chartInterval">
                        <option value="1m">1m</option>
                        <option value="3m">3m</option>
                        <option value="5m">5m</option>
                        <option value="15m">15m</option>
                        <option value="30m">30m</option>
                        <option value="1h">1h</option>
                        <option value="2h">2h</option>
                        <option value="4h">4h</option>
                        <option value="6h">6h</option>
                        <option value="8h">8h</option>
                        <option value="12h">12h</option>
                        <option value="1d">1d</option>
                        <option value="3d">3d</option>
                        <option value="1w">1w</option>
                        <option value="1M">1M</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <transition name="fade">
                <div v-if="loadingCandles" key="loadingCandles">
                  <i class="fas fa-spinner fa-spin"></i> LOADING CANDLES!!11
                </div>
                <div v-else key="candlesLoaded" id="candlesLoaded">
                  <span>
                    <span class="badge badge-primary">Open: {{ candlesOpen }}</span>
                    <span class="badge badge-success">High: {{ candlesHighest }}</span>
                    <span class="badge badge-danger">Low: {{ candlesLowest }}</span>
                    <span class="badge badge-warning">Last: {{ candlesClose }}</span>
                  </span>
                  <div id="candleChart">
                    <div id="chartPrices">
                      <div v-for="price in chartPrices"
                           class="priceLine"
                           :style="{'top': getCandleTopPosition(price)+'%',
                                    'display': getCandleTopPosition(price) - getCandleTopPosition(candlesClose) < 4 && getCandleTopPosition(price) - getCandleTopPosition(candlesClose) > -4 ? 'none' : 'inline-block'
                                   }"> <!--we hide the line if its too close to the currentprice line -->
                        <span class="price">{{ price }}</span>
                      </div>
                      <div class="priceLine currentPrice"
                           :style="{'top': getCandleTopPosition(candlesClose)+'%'}">
                        <span class="price"><span class="badge badge-warning">{{ candlesClose }}</span></span>
                      </div>
                    </div>
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
                  <div id="candleChartVolume">
                    <div v-for="candle in candlesData"
                         class="candle">
                       <div class="VolumeBar"
                            :style="{
                                      'height': getCandleVolumeHeight(candle[5])+'%',
                                      'background-color': getCandleColor(candle)
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
      symbolFilter: '',
      chartInterval: '1h'
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
    getCandles: function(symbol, chartInterval) {
      this.loadingCandles = true;
      this.$http.get('http://pinguino.sonet.cl/binance-api/getCandles.php?symbol='+symbol+'&interval='+chartInterval+'&limit=24')
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
    getCandleVolumeHeight: function(volume) {
      return (volume*100 / this.candlesHighestVoume);
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
      var highest = parseFloat(this.candlesData[0][2]);
      this.candlesData.map(function(candle) {
        if (parseFloat(candle[2]) > highest) highest = parseFloat(candle[2]);
      });
      return highest;
    },
    candlesLowest: function() {
      var lowest = parseFloat(this.candlesData[0][2]);
      this.candlesData.map(function(candle) {
        if (parseFloat(candle[3]) < lowest) lowest = parseFloat(candle[3]);
      });
      return lowest;
    },
    candlesHighestVoume: function() {
      var highest = parseFloat(this.candlesData[0][5]);
      this.candlesData.map(function(candle) {
        if (parseFloat(candle[5]) > highest) highest = parseFloat(candle[5]);
      });
      return highest;
    },
    candlesOpen: function() {
      if (this.candlesData.length > 0) return parseFloat(this.candlesData[0][1]);
      else return '';
    },
    candlesClose: function() {
      if (this.candlesData.length > 0) return parseFloat(this.candlesData[this.candlesData.length-1][4]);
      else return '';
    },
    chartPrices: function() {
      var rows = 5;
      var interval = (this.candlesHighest - this.candlesLowest) / rows;
      var prices = [];
      for (var i = 0; i <= rows; i++) {
        let rest = interval * i;
        let price = this.candlesHighest-rest;
        let priceRounded = Math.round(price * 100000000) / 100000000; // round to 8 decimal digits max
        prices.push(priceRounded);
      }
      return prices;
    }
  },
  watch: {
    selectedSymbol: function(newSymbol,oldSymbol) {
      if (newSymbol) {
        this.getCandles(newSymbol,this.chartInterval);
      }
    },
    chartInterval: function(newInterval,oldInterval) {
      if (newInterval) {
        this.getCandles(this.selectedSymbol,newInterval);
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
    min-height:480px;
    width: 100%;
    margin-right:auto;
    margin-left:0px;
  }

  #candleChartContainer #candlesLoaded {
    width:80%;
  }

  #candleChart {
    height: 300px;
    position: relative;
  }

  #candleChartVolume {
    height: 70px;
    position: relative;
  }

  #candleChart .candle, #candleChartVolume .candle {
    width: 3.2%;
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

  #candleChartVolume .candle .VolumeBar {
    width: 90%;
    position: absolute;
    left: 0;
    min-height: 0.5%;
    bottom:0;
    opacity:0.7;
  }

  #candleChart #chartPrices {
    position:absolute;
    top:0;
    height:100%;
    width:100%;
  }

  #candleChart #chartPrices > .priceLine {
    position:absolute;
    border-top: 1px solid lightgray;
    width:100%;
    text-align:right;
  }

  #candleChart #chartPrices > .priceLine > .price {
    position:relative;
    top:-13px;
    right:-70px;
    font-size:0.7rem;
    width:60px;
    text-align:left;
    display:inline-block;
  }

  #candleChart #chartPrices > .priceLine.currentPrice {
    border-top: 1px dashed lightgray;
  }

  #candleChart #chartPrices > .priceLine.currentPrice > .price {
    right:-65px;
  }

  #candleChart #chartPrices > .priceLine.currentPrice > .price > span {
    font-size: 100%;
  }

  #candleChart #chartPrices > .priceLine.currentPrice > .price::before {
    content: '▸';
    position: absolute;
    left: -7px;
  }
</style>
