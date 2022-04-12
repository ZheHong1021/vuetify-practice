<template>
  <div class="main-container">
    <h1 class="mb-6 text-sm-h4 text-h5">蝦苗餵食量紀錄</h1>
    <v-card :width="rwd_width" :class="rwd_padding">
        <v-row>
            <v-col cols="12">
                <v-row>
                    <v-col cols="12" sm="6" class="text-left">
                        <!-- 上一頁功能不能在第一頁顯示 -->
                        <!-- 設置點擊事件來返回上一頁 (router.back) -->
                        <v-btn color="primary"  outlined v-if="$route.path !== '/feed' " @click="$router.back()">
                            <v-icon left>arrow_circle_left</v-icon>
                            回上一頁
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" class="text-right">
                        <v-chip id="top" color="blue-grey darken-1" class="white--text font-weight-bold py-6 px-4" label>
                            <v-icon left color="white">schedule</v-icon>
                            {{nowDate}} {{nowWeek}} {{nowTime}}
                        </v-chip>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12">
                <router-view></router-view>
            </v-col>
        </v-row>
    </v-card>
  </div>  
</template>

<script>

export default {
  components: {

  },
  data(){
    return({
        nowDate: "",    // 当前日期
        nowTime: "",    // 当前时间
        nowWeek: ""     // 当前星期
    })
  },
  computed: {
        // v-card寬度
        rwd_width () { 
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "100%"
                case 'sm': return "90%"
                case 'md': return '80%'
                case 'lg': return '80%'
                case 'xl': return '70%'
            }
            return '100%' // 不用理會
        },
        // v-card寬度
        rwd_padding () { 
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "pa-3"
                case 'sm': return "pa-3"
                case 'md': return 'pa-4'
                case 'lg': return 'pa-4'
                case 'xl': return 'pa-4'
            }
            return 'pa-2' // 不用理會
        },
  },

  created(){
      
  },

  methods: {
    dealWithTime(data) { // 获取当前时间
        let Y = data.getFullYear(); // 年
        let M = data.getMonth() + 1; // 月(0為 1月，所以要+1)
        let D = data.getDate(); // 日
        let H = data.getHours(); // 小時
        let Min = data.getMinutes(); // 分
        let S = data.getSeconds(); // 秒
        let W = data.getDay(); // 星期(0~6: 一~日)
        H = H < 10 ? "0" + H : H; // 小時為個位數及二位數的處理
        Min = Min < 10 ? "0" + Min : Min; // 分為為個位數及二位數的處理
        S = S < 10 ? "0" + S : S; // 秒為個位數及二位數的處理

        switch (W) {
            case 0: W = "日"; break;
            case 1: W = "一"; break;
            case 2: W = "二"; break;
            case 3: W = "三"; break;
            case 4: W = "四"; break;
            case 5: W = "五"; break;
            case 6: W = "六"; break;
            default: break;
        }
        this.nowDate = `${Y}年${M}月${D}日`;
        this.nowWeek = `周${W}`; 
        this.nowTime = `${H}:${Min}:${S}`;
        },
  },

  mounted() { 
    // 页面加载完后显示当前时间
    this.dealWithTime(new Date())

    // 定时刷新时间
    this.timer = setInterval(()=> {
       this.dealWithTime(new Date()) // 修改数据date
    }, 500)
  }, 

  destroyed() {
    if (this.timer) {  // 注意在vue实例销毁前，清除我们的定时器
      clearInterval(this.timer);
    }
  }

}
</script>

