<template>
  <div v-if="crypto" class="crypto-view">
    <router-link class="reload" to="/">←</router-link>
    <span :class="[{ 'confirm': removeConfirm}]" class="delete" @click="removeCrypto">☠</span>
    <h1>{{ crypto.id }} : <input type="number" v-model="crypto.number" @change="saveWallet"></h1>
    <h2>{{ crypto.totalAmount }} $</h2>
    <h3>{{ crypto.price_btc }} ₿/each</h3>
    <h3>{{ crypto.price_usd }} $/each</h3>
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
  </div>
</template>

<script>

export default {
  name: 'crypto-view',
  data() {
    return {
      msg: 'Welcome to crypto boy, cryptocurrencies personal assistant',
      id: 'toto',
      crypto: null,
      removeConfirm: false
    };
  },
  methods: {
    loadCrypto() {
      this.cryptoArray = JSON.parse(localStorage.getItem('cryptos'));
      Object.entries(this.cryptoArray).map((x) => {
        if (x[1].id === this.id) {
          this.crypto = x[1];
        }
      });
    },
    removeCrypto() {
      if (this.removeConfirm) {
        Object.entries(this.cryptoArray).map((x, y) => {
          if (x[1].id === this.id) {
            this.cryptoArray.splice(y, 1);
            console.log(y);
          }
          return x;
        });
        // this.cryptoArray.splice(key, 1);
        this.remove = false;
        this.removeConfirm = false;
        this.saveWallet();
        this.$router.push('/');
      }
      this.removeConfirm = true;
    },
    saveWallet() {
      localStorage.setItem('cryptos', JSON.stringify(this.cryptoArray));
    },
    saveTotal() {
      localStorage.setItem('walletUsd', this.totalCryptoAmountUsd);
      localStorage.setItem('walletBtc', this.totalCryptoAmountBtc);
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.loadCrypto();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.crypto-view {
  width: 20%;
  display: inline-block;
  margin: 0 auto;
}
.percent {
  background: khaki;
  color: midnightblue;
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

.delete {
  font-size: 2em;
}
.delete.confirm {
  display: inline-block;
  padding: 0 0.15em 5px;
  margin-bottom: 20px;
  font-size: 3em;
  color: white;
  border-radius: 25px;
  background-color: orangered;  
  transition: all .3s ease-in, ;
}
.back {
  font-size: 4em;
  text-decoration: none;
  color: lightseagreen;
}
.crypto-view input[type=number] {
  width: 4em;
  font-size: 1em;
}

.reload {
  position: absolute;
  width: 100px;
  height: 100px;
  right: 0;
  top: 0;  
}

@media screen and (max-width: 600px) {
  .crypto-view {
    width: 80%;
    margin-top: 20%;
  }
  .percent {
    display: inline-block;
    width: 30%;
  }
  .delete {
    position: absolute;
    left: 20px;
    top: 70px;
  }
}
</style>
