<template>
        <v-row>
            <v-col cols="12">
                <v-subheader class="text-body-1 red--text pa-0 mb-6" style="font-weight: bolder;" >
                    <v-icon color="red">mdi-calendar</v-icon>
                    &nbsp;昨日紀錄
                    
                    <div class="ml-auto text-right">
                        <v-chip class="ma-2 white--text" :color="manual_record ? 'deep-purple accent-4' : 'light-blue darken-3'">
                            <v-icon left small>{{ manual_record ? "mdi-wrench" : "mdi-robot"}}</v-icon>
                            {{ manual_record ? "人工紀錄" : "電腦紀錄" }}
                        </v-chip>
                        <br>
                        <!-- 必須要有人工紀錄才會有紀錄時間 -->
                        <span class="black--text text-subtitle-2" v-if="manual_record">紀錄時間: {{ record_time }}</span>
                    </div>
                </v-subheader>
                <v-row>
                    <v-col cols="6">
                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">長度</label>
                        <v-text-field v-model="yesterday_select.length" class="disable-input" disabled readonly solo  prepend-inner-icon="mdi-ruler" :suffix="$vuetify.breakpoint.name === 'xs' ? 'cm' : '公分 / cm'"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">重量</label>
                        <v-text-field v-model="yesterday_select.weight" class="disable-input" disabled readonly solo  prepend-inner-icon="mdi-weight-gram" :suffix="$vuetify.breakpoint.name === 'xs' ? 'g' : '公克 / g' "></v-text-field>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">水溫</label>
                        <v-text-field v-model="yesterday_select.temp" class="disable-input"  suffix="℃" label="水溫" disabled readonly solo prepend-inner-icon="mdi-thermometer-alert"></v-text-field>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">水質</label>
                        <v-text-field v-model="yesterday_select.water" class="disable-input"  label="水質" disabled readonly solo prepend-inner-icon="mdi-water-check"></v-text-field>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">飼料種類</label>
                        <v-text-field v-model="yesterday_select.feed" class="disable-input" label="飼料種類" disabled readonly solo prepend-inner-icon="mdi-crowd"></v-text-field>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">品種</label>
                        <v-text-field v-model="yesterday_select.breed" class="disable-input" label="品種" disabled readonly solo prepend-inner-icon="mdi-ballot"></v-text-field>
                    </v-col>
                </v-row>

                <v-subheader class="text-body-1 red--text" style="font-weight: bolder;" >
                    <v-icon color="red">mdi-pen-plus</v-icon>
                    &nbsp; 餵食量計算結果
                </v-subheader>
                <v-row>
                    <v-col cols="12">
                        <h3>投放的餵食量: {{ total_feed }}</h3>
                    </v-col>
                </v-row>

                <v-divider class="mt-8"></v-divider>
            </v-col>

            <v-col cols="12">
                <div class="text-center">
                    <v-btn :width="btn_rwd_width" height="50px" color="error" @click="dialog = true">
                        <v-icon left>playlist_add</v-icon>
                        添加新紀錄
                    </v-btn>
                </div>
            </v-col>

            <!-- 透過 dialog決定是否開啟； 而 @close為 子元件將父元件資料改變的方法' ； yesterday為昨日的紀錄 -->
            <FeedWriteDialog :dialog="dialog" @close="dialog = false" :yesterday="yesterday_select"/>
        </v-row>
</template>

<script>
import FeedWriteDialog from '@/components/FeedWriteDialog.vue'
export default {
    name: "Write",
  components: {
      FeedWriteDialog,
  },
  data(){
      return{
        date_menu: false,
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dialog: false,

        yesterday_select:{
            length: "",
            weight: "",
            temp: "",
            water: "",
            feed: "",
            breed: "",
        },

        manual_record: false, // 人工紀錄(True / False)
        record_time: "", // 紀錄時間
        total_feed: "", // 餵食量
      }
  },

  mounted(){
    this.yesterday_select.length = "3.5"
    this.yesterday_select.weight = "15"
    this.yesterday_select.temp = "30.1"
    this.yesterday_select.water = "良好"
    this.yesterday_select.feed = "A飼料"
    this.yesterday_select.breed = "白蝦"
    this.manual_record = true;
    this.record_time = "2022-04-12 11:08:57";
    this.total_feed = "23.87";
  },

computed: {
    // 按鈕RWD
    btn_rwd_width () { 
        switch (this.$vuetify.breakpoint.name) {
            case 'xs': return "90%"
            case 'sm': return "80%"
            case 'md': return '70%'
            case 'lg': return '60%'
            case 'xl': return '50%'
        }
        return '100%' // 不用理會
    },

    step_show_big(){
        switch (this.$vuetify.breakpoint.name) {
            case 'xs': return false;
            case 'sm': return false;
            case 'md': return true;
            case 'lg': return true;
            case 'xl': return true;
        }
        return true; // 不用理會
    },
},


  methods: {
    
  },

    
}
</script>


<style scoped>
/* 強制將 disabled的文字顏色做修改 */
    .disable-input >>> input {
        color: #000 !important;
    }
    
</style>