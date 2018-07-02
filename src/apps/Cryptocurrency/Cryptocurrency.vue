<template>
  <div>
    <h2>Cryptocurrency!</h2>
    <div class="alert alert-info">Data taken from <a href="https://coinmarketcap.com/api/">https://coinmarketcap.com/api/</a></div>
    <table class="table table-sm table-striped table-responsive-md">
      <thead>
        <tr>
          <th><span class="d-none d-sm-inline-block">Rank</span><span class="d-sm-none d-inline-block">#</span></th>
          <th class="d-none d-sm-table-cell">Name</th>
          <th>Symbol</th>
          <th>Price</th>
          <th class="d-none d-sm-table-cell">24h Volume</th>
          <th class="d-none d-sm-table-cell">Market Cap</th>
          <th>24h Change</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="crypto in cryptoDataOrderedByRank" :key="crypto.rank">
            <td>{{ crypto.rank }}</td>
            <td class="d-none d-sm-table-cell">{{ crypto.name }}</td>
            <td>{{ crypto.symbol }}</td>
            <td>${{ crypto.quotes.USD.price }}</td>
            <td class="d-none d-sm-table-cell">${{ addThousandSeparator(crypto.quotes.USD.volume_24h) }}</td>
            <td class="d-none d-sm-table-cell">${{ addThousandSeparator(crypto.quotes.USD.market_cap) }}</td>
            <td :class="{ 'text-success':crypto.quotes.USD.percent_change_24h > 0,
                          'text-danger':crypto.quotes.USD.percent_change_24h < 0}">
              {{ crypto.quotes.USD.percent_change_24h }}%
            </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data: function() {
    return {
      cryptoData: []
    }
  },
  methods: {
    getCryptoData: function() {
      this.$http.get('https://api.coinmarketcap.com/v2/ticker/?limit=100')
      .then(response=> {
        return response.json();
      })
      .then(data => {
        this.cryptoData = data.data;
      }, error => {
        // TODO : Handle errors
        this.cryptoData = [];
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
    }
  },
  computed: {
    cryptoDataOrderedByRank: function () {
      return _.orderBy(this.cryptoData, 'rank')
    }
  },
  mounted: function() {
    this.getCryptoData();
  }
}
</script>

<style scoped>
</style>
