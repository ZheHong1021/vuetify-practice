<template>
  <v-footer color="primary lighten-1" padless>
    <v-row justify="center" no-gutters>
    
        <v-col cols="12" class="text-center">
            <v-btn v-for="route in routes" :key="route.link" color="white" text rounded class="my-2">
                <router-link class="white--text" :to="route.link">{{ route.title }}</router-link>
            </v-btn>
        </v-col>
    
      <v-col cols="12" class="blue lighten-5 text-center">
            <img class="mirdc" src="@/assets/images/MIRDC.png"></img>
      </v-col>

      <v-col class="blue lighten-5 py-4 text-center " cols="12">
        <strong>{{ new Date().getFullYear() }} — UC 開發</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
    name: "Footer",
    data: () => ({
        routes: [
          { title: 'Home', icon: 'home', link: '/' },
          { title: 'About', icon: 'forum', link: '/about' },
          { title: 'SweetAlert', icon: 'gpp_maybe', link: '/sweetAlert' },
        ],
    }),

    computed:{
    }
}
</script>

<style lang="scss" scoped>
    .mirdc{
        width: 25%;
    }
    
    @media screen and (max-width: 1067px) {
        .mirdc{
            width: 40%;
        }
    }

    @media screen and (max-width: 767px) {
        .mirdc{
            width: 45%;
        }
    }
    @media screen and (max-width: 577px) {
        .mirdc{
            width: 70%;
        }
    }
</style>