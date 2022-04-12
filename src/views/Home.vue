<template>
  <div class="main-container">
    <!-- The video -->
    <video autoplay muted loop id="myVideo">
      <source src="../assets/images/fish_-_1080 (Original).mp4" type="video/mp4">
    </video>

    <v-row class="text-center text-container" style="min-height: calc(100vh - 5vh);">
      <v-col cols="12" class="d-flex flex-column justify-center align-center">
        <h1 class="text-h4 text-lg-h3 text-md-h4 text-sm-h5">歡迎使用養殖系統</h1>
        <br>
        <p>本系統目標為讓使用者可以得知養殖池蝦子的成長情況</p>
        <v-btn rounded color="success" dark x-large @click="$router.push('/about')">
              <v-icon class="mr-2">start</v-icon>
              Start
          </v-btn>
      </v-col>
    </v-row>

    <v-row class="text-center text-container">
        <v-col cols="12" class="d-flex flex-column justify-center align-center">
          <h1 class="text-h4 text-lg-h2 text-md-h4 text-sm-h5">推薦</h1>
        </v-col>
    </v-row>

    <v-row class="text-center text-container">
        <v-col cols="12" class="d-flex flex-column justify-center align-center">
          <h1 class="text-h4 text-lg-h2 text-md-h4 text-sm-h5">介紹</h1>
        </v-col>
    </v-row>

    <v-row class="text-center text-container">
        <v-col cols="12" class="d-flex flex-column justify-center align-center">
          <h1 class="text-h4 text-lg-h2 text-md-h4 text-sm-h5">回饋</h1>
        </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';
  export default {
    components: {
      
    },
    methods:{

    },
    created(){
      axios.get('/api').then(
            res => {
                console.log(res);
            },
            error => {
                alert(error) //沒接收到 印出ERROR
            }
        )
    },


  }
</script>


<style lang="scss" >
    #myVideo {
      position: fixed;
      right: 0;
      bottom: 0;
      min-width: 100%;
      min-height: 100%;
    }

    .text-container{
      z-index: 1;
      color: white;
      min-height: 700px;
      height: 100%;
    }

</style>  