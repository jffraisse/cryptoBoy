<template>
  <div class="crypto-list">
    <p @click="loadCrypto()" class="reload"></p>
    <p v-if="cryptoArray && cryptoArray.length > 0" class="crypto-length">{{ cryptoArray.length }}</p>
    <label class="crypto-length" v-if="!add" @click="add = true">+ {{add}}</label>
    <div v-if="add" class="add">
      <input type="text" v-model="query" placeholder="type your currency"></input>
      <input type="number" v-model="number" placeholder="how much you've got"></input>
      <span @click="addCrypto(query, number)">+</span>
    </div>
    <p v-if="apiError">{{apiError}}</p>

    <h1 v-if="totalCryptoAmountUsd || totalCryptoAmountBtc">{{totalCryptoAmountUsd | getRoundNumber}}$ => {{totalCryptoAmountBtc | around}}Btc</h1>
    <ul class="list">
      <li v-for="crypto in cryptoArray" :key="crypto.id">
        <router-link :to="{ path: crypto.id }">
          <p class="loader" :class="[{ hide: crypto.loaded}]"><img src="../assets/loader.svg"></p>
          <h2>{{ crypto.number }} <span>{{ crypto.id }}</span></h2>
          <h2><span class="arrow" :class="[{ up: crypto.percent_change_7d > 1, down: crypto.percent_change_7d < -1}]"></span>{{ crypto.totalAmount | getRoundNumber }} $</h2>
          <h3>{{crypto.price_btc}} ₿</h3>
          <h3>{{crypto.price_usd}} $</h3>
          <p class="percent" :class="[{ bullish: crypto.percent_change_1h > 5,
                                        chillOut: crypto.percent_change_1h > 1,
                                        chill: crypto.percent_change_1h < -1,
                                        fallin: crypto.percent_change_1h < -4,
                                        dyin: crypto.percent_change_1h < -20 }]">{{ crypto.percent_change_1h }}%</p>

          <p class="percent" :class="[{ bullish: crypto.percent_change_24h > 5,
                                        chillOut: crypto.percent_change_24h > 1,
                                        chill: crypto.percent_change_24h < -1,
                                        fallin: crypto.percent_change_24h < -4,
                                        dyin:  crypto.percent_change_24h < -20 }]">{{ crypto.percent_change_24h }}%</p>

          <p class="percent" :class="[{ bullish: crypto.percent_change_7d > 5,
                                        chillOut: crypto.percent_change_7d > 1,
                                        chill: crypto.percent_change_7d < -1,
                                        fallin: crypto.percent_change_7d < -4,
                                        dyin: crypto.percent_change_7d < -20 }]">{{ crypto.percent_change_7d }}%</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>

import CryptoView from '@/components/CryptoView';

export default {
  name: 'crypto-list',
  components: { CryptoView },
  data() {
    return {
      apiError: '',
      number: '',
      query: '',
      cryptoArray: [],
      totalCryptoAmountBtc: null,
      totalCryptoAmountUsd: null,
      removeState: null,
      add: null
    };
  },
  methods: {
    loadLocalStorage() {
      const localData = JSON.parse(localStorage.getItem('cryptos'));
      if (localData) {
          this.cryptoArray = localData;
          this.loadCrypto();
          this.getTotalWallet(this.cryptoArray);
      }
    },
    loadCrypto() {
      this.cryptoArray = JSON.parse(localStorage.getItem('cryptos'));
      this.cryptoArray.sort((a, b) => b.totalAmount - a.totalAmount);
      Object.entries(this.cryptoArray).map((x, index) => {
        this.cryptoArray[index].loaded = false;
        const url = `https://api.coinmarketcap.com/v1/ticker/${x[1].id}/`;
        this.$http.get(url).then(response => {
          const amount = x[1].number * response.body[0].price_usd;
          this.data = response.body[0];
          this.data.loaded = true;
          this.data.number = x[1].number;
          this.data.totalAmount = amount;
          this.cryptoArray.splice(index, 1, this.data);
          this.saveWallet();
          this.getTotalWallet(this.cryptoArray);
        }, response => {
          this.error = response;
          this.data = Object.assign({}, JSON.parse(localStorage.getItem('cryptos'))[index]);
          this.data.loaded = false;
          this.cryptoArray.splice(index, 1, this.data);
          this.saveWallet();
          return this.error;
        });
      });
    },
    getTotalWallet() {
      this.totalCryptoAmountUsd = null;
      this.totalCryptoAmountBtc = null;
      Object.entries(JSON.parse(localStorage.getItem('cryptos'))).map((x) => {
        this.totalCryptoAmountUsd += x[1].number * x[1].price_usd;
        this.totalCryptoAmountBtc += x[1].number * x[1].price_btc;
        this.saveTotal();
        return this.totalCryptoAmountBtc;
      });
    },
    saveWallet() {
      localStorage.setItem('cryptos', JSON.stringify(this.cryptoArray));
    },
    saveTotal() {
      localStorage.setItem('walletUsd', this.totalCryptoAmountUsd);
      localStorage.setItem('walletBtc', this.totalCryptoAmountBtc);
    },
    addCrypto(crypto, number) {
        const url = `https://api.coinmarketcap.com/v1/ticker/${crypto}/`;
        this.$http.get(url).then(response => {
          this.data = response.body[0];
          const amount = number * response.body[0].price_usd;
          this.data.number = number;
          this.data.loaded = true;
          this.data.totalAmount = amount;
          this.cryptoArray.push(this.data);
          this.saveWallet();
          this.getTotalWallet(this.cryptoArray);
          return this.cryptoArray;
        }, response => {
          this.apiError = response.body.error;
          return this.error;
        }).then(() => {
          this.cryptoArray.sort((a, b) => b.totalAmount - a.totalAmount);
        });
    },
  },
  filters: {
    getRoundNumber(value) {
      if (!value) return '';
      return Math.round(value);
    },
    around(value) {
      if (!value) return '';
      return Number.parseFloat(value).toFixed(4);
    }
  },
  mounted() {
    this.loadLocalStorage();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #35495E;
}
.percent {
  background: khaki;
  margin: 0;
  color: midnightblue;
  border-bottom: 1px solid white;
  padding: 5px 0;
}
.percent.chillOut {
  background: yellowgreen;
  color: white;
}
.percent.bullish {
  background: green;
}
.percent.chill {
  background: orange;
  color: white;
}
.percent.fallin {
  background: red;
}
.percent.dyin {
  background: firebrick;
}
.ask-remove {
  font-size: 20px;
  font-weight: bold;
  background: steelblue;
  color: white;
  padding: 2px 10px;
  border-radius: 15px;
}

.crypto-length {
  font-size: 20px;
  background-color: #61b7b7;
  color: white;
  display: inline-block;
  padding: 2px 7px;
  border-radius: 10px;
}

label.crypto-length {
  position: absolute;
  left: 20px;
  top: 70px;
}

.add input {
  width: 8em;
  height: 2em;
  padding: 0.5em;
  margin-right: 10px;
  font-size: 1.5em;
  vertical-align: top;
}

.add span {
  font-size: 4.2em;
}

.reload {
  position: absolute;
  width: 100px;
  height: 100px;
  right: 0;
  top: 0;  
}

.reload:hover,
.reload:focus {
  cursor: pointer;
}

.crypto-list {
  width: 80%;
  margin: 0 auto;
}

.list h2 {
  border: 1px solid teal;
  font-size: 1.2em;
  color: teal;
}

.list h3 {
  color: aliceblue;
  background: #61b7b7;
  font-weight: 100;
  padding: 5px 5px;
  margin: 0;
}

.list p + h2 {
  padding: 5px 0;
  margin: 0;
}

.list p + h2 span {
  display: block;
}

.list h2 + h2 {    
  font-size: 1.5em;
  color: white;
  border: none;
  border-top: 1px solid white;
  background: #61b7b7;
  padding: 5px 0;
  margin: 0;
}

.list h3 + h3 {
  border-bottom: 1px solid white;
}

.list li {
  margin: 0 .5em 2em;
  background-color: ghostwhite;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: block;
  height: 100%;
  width: 100%;
  margin: 0;
  background: rgba(255, 255, 255, .8);
}

.loader img {
  margin-top: 65%;
}

.hide {
  display: none;
}

.list li {
  position: relative;
}

.list li:hover,
.list li:active,
.list li:focus  {
  background-color: white;
  transition: background-color .1s ease-in-out;
}

.list a {
  text-decoration: none;
}

.list a * {
  line-height: 1em;
}

.arrow {
  position: relative;
  display: inline-block;
  width: auto !important;
  top: 1px;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  z-index: 0;
  padding: 0 !important;
  margin-right: 3px;
}

.arrow.up:after {
  content: '\21D6';
}

.arrow.down:after {
  content: '\21D9';
}

@media screen and (max-width: 600px) {
  .list li {
    width: 100%;
    margin: 0 0 10px 0;
    padding: 0 0 10px;
    background-color: #61b7b7;
  }
  .list li:hover,
  .list li:active,
  .list li:focus  {
    background-color: teal;
    transition: background-color .1s ease-in-out;
  }
  .list li a {
    display: inline-block;
    width: 100%;
  }
  .list li a * {
    display: inline-block;
    border: none;
    vertical-align: middle;
    padding: 2px;
  }
  .list p + h2 {
    width: 100%;
    color: white;
    border: 1px solid white;
    padding: 5px 0;
    margin-bottom: 10px;
    font-size: 1.5em !important;
  }
  .list p + h2 span {
    display: inline;
    vertical-align: top;
  }
  .list p {
    border-radius: 2px;
    font-size: 1.3em;
  }
  .list h2 + h3,
  .list h3 + h3 {
    display: none;
  }
  .list h2 {
    font-size: 1.2em !important;
  }
  .list li a p.loader {
    width: 100%;
  }
  .list li a p.loader.hide {
    display: none;
  }
  .loader img {
    margin-top: 5%;
    width: 10%;
  }
  .arrow {
    top: -2px;
  }
  .add {
    text-align: center;
  }
  .add input {
    margin: 0 auto 10px;
    display: block;
  }
  .add span {
    border: 1px solid black;
    border-radius: 2em;
    padding: 0px 13px;
    font-size: 3.2em;
  }
  .crypto-list {
    width: 90%;
    margin: 0 auto;
  }
}

</style>
