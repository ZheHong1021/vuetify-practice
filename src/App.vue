<template>
  <v-app>
    <!-- Navigation -->
    <Navbar/>

    <v-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>


      <!-- 回頂部的按鈕: 只要頁面往下滑動則會浮出按鈕(手機板不要有 tooltip效果) -->
      <v-tooltip 
        top color="blue-grey darken-4"
        :disabled = "is_mobile">
        <template v-slot:activator="{ on, attrs }">
            <div v-scroll-to="{ el: '#app', offset: -65}" 
                class="goTop d-flex justify-center align-center"
                :class="isTop ? 'goTopAfter' : ''" 
                v-bind="attrs"
                v-on="on">
                <v-icon color="white">mdi-arrow-up</v-icon>
            </div>
        </template>
          <span>回頂部</span>
      </v-tooltip>

    </v-main>

    <Footer  />
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export default {
  name: 'App',
  components: { 
    Navbar, 
    Footer, 
  },
  
  data: () => ({
      scrollNum: 0, //滾動距離
      isTop: false, //是否顯示回到頂部按鈕
  }),

  mounted(){
    // scroll btn 出現(只要移動高度超過 200)
    /* https://iter01.com/548137.html */
      window.addEventListener("scroll", () => {
          let top =
              document.documentElement.scrollTop ||
              document.body.scrollTop ||
              window.pageYOffset;
          this.scrollNum = top;
          if (top >= 200) {
              this.isTop = true;
          } else {
              this.isTop = false;
          }
      });
  },
};
</script>


<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: .25s;
  }
  body{
    font-size: 100%;
  }

  a{
    list-style: none;
    text-decoration:none;
  }

  /* 所有 View的 container */
  .main-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 15vh);
    padding: 15px 10px;
  }


  /* ScrollBar Style */
  ::-webkit-scrollbar-track
  {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar
  {
    width: 8px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #7f8fa6;
  }



/* 回頂部按鈕樣式設計 */
.goTop {
  position: fixed;
  bottom: -200px;
  right: 5%;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  z-index: 10;
  background-color: #57606f;
  transition: 0.3s ease-in-out;
  font-size: 30px;
  text-align: center;
  line-height: 60px;
  transition: 0.3s ease-in-out;
  cursor: pointer;
}

.goTop:hover {
  background-color: #2c3e50;
  transition: 0.3s ease-in-out;
}
.goTopAfter {
  transition: 0.3s ease-in-out;
  bottom: 50px;
}


/* 手機介面下，下面一點 */
@media screen and (max-width: 577px) {
  .goTop{
    width: 50px;
    height: 50px;
    font-size: 12px;
  }

  .goTopAfter {
    bottom: 2.5%;
  }
}


</style>