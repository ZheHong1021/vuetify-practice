<template>
  <v-app>
    <!-- Navigation -->
    <Navbar/>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <Footer />
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
  }
  body{
    font-size: 100%;
  }

  a{
    list-style: none;
    text-decoration:none;
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