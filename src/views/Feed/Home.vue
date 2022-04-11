<template>
    <v-row class="text-center">
        <v-col cols="12" md="6">
            <v-btn class="ma-2 pink darken-1" dark elevation="4" :min-width="rwd_width" :min-height="rwd_height" @click="$router.push({name: 'feed_read'})">
                <v-icon dark left x-large>saved_search</v-icon>
                &nbsp;
                <h1>查詢</h1>
            </v-btn>
        </v-col>
        <v-col cols="12" md="6">
            <v-btn class="ma-2 teal darken-2" dark elevation="4" :min-width="rwd_width" :min-height="rwd_height" @click="$router.push({name: 'feed_write'})">
                <v-icon dark left x-large>edit_note</v-icon>
                &nbsp;
                <h1>記錄</h1>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>

export default {
  components: {

  },
  data(){
    return({

    })
  },

  created(){

  },
    computed: {
        // v-card寬度
        rwd_width () { 
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "100%"
                case 'sm': return "70%"
                case 'md': return '80%'
                case 'lg': return '80%'
                case 'xl': return '70%'
            }
            return '100%' // 不用理會
        },
        rwd_height(){
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "200px"
                case 'sm': return "250px"
                case 'md': return '300px'
                case 'lg': return '350px'
                case 'xl': return '400px'
            }
            return '100%' // 不用理會
        }
    },
}
</script>


<style lang="scss" scoped>

</style>
