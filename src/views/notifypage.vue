
<template>
    <div id="container">
        <h5 id="titlebar"><b>Mr. Noplay Notification</b></h5>
        <hr>
        <div id="div">
            <h2 id="title">{{ this.title }}</h2>
            <h5 id="message">{{ this.message }}</h5>
        </div>
        <a id="close" href="javascript:window.close()">OK</a>
    </div>
</template>

<script>
export default {
  name: 'notifypage',
  data() {
    return {
        title: '',
        message: '',
    };
  },
  mounted: function() {
      this.title = localStorage.getItem('nftitle');
      this.message = localStorage.getItem('nfmessage');
  },
  methods: {

  },
}
</script>
<style scoped>
#container {
    font-family: system, -apple-system, '.SFNSText-Regular', 'SF UI Text', 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, sans-serif;
    color: #fff;
    background-color: #8aba87;
    text-align: center;
    width: 100%;
    height: 100%;
    position: absolute;
}

#titlebar {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -10%);
}

#div {
    padding: 0;
    margin: 0;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -60%);
}

h2,h5 {
    padding: 0;
    margin: 0; 
}

#close {
    color: white;
    opacity: 0.7;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    text-decoration: none;
}
</style>