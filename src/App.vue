<template>
  <v-app>
    <!-- Navigation -->
    <Navbar/>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
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
    
  }),

  created(){
    console.log();
  },
};
</script>


<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: .4s;
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

    
    /* 全體字型的RWD設定 */
    @media screen and (max-width: 1440px) {
        body{
          font-size: 80%;
        }
    }
    @media screen and (max-width: 1024px) {
        body{
          font-size: 70%;
        }
    }

    @media screen and (max-width: 768px) {
        body{
          font-size: 60%;
        }
    }
    @media screen and (max-width: 578px) {
        body{
          font-size: 50%;
        }
    }
</style>