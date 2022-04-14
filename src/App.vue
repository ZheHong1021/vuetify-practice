<template>
  <v-app>
    <!-- Navigation -->
    <Navbar/>

    <v-main>

      <v-container fluid >
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


</style>