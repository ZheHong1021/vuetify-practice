<template>
  <div>
      <v-row>
            <v-col cols="12">
                <v-subheader class="text-body-1 red--text pa-0 mb-6" style="font-weight: bolder;" >
                    <v-icon color="red">mdi-calendar</v-icon>
                    &nbsp;{{ record.created_at }}
                    <div class="ml-auto text-right">
                        <span class="black--text text-subtitle-2">上一次更新時間: {{ record.updated_at }}</span>
                    </div>
                </v-subheader>
                <v-row>
                    <v-col cols="12">
                      <label for="question_one" class="deep-orange--text font-weight-bold">記錄者</label>
                        <v-select  v-model="record.name" :items="record_name_List"
                            menu-props="auto" label="選擇記錄人員" 
                            prepend-inner-icon="mdi-account-box" solo
                        ></v-select>
                    </v-col>
                    <v-col cols="6">
                        <label for="question_one" class="deep-orange--text font-weight-bold">長度</label>
                        <v-text-field @change="changeWeight" v-model="record.length" class="disable-input" solo  prepend-inner-icon="mdi-ruler" :suffix="$vuetify.breakpoint.name === 'xs' ? 'cm' : '公分 / cm'"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <label for="question_one" class="deep-orange--text font-weight-bold">重量</label>
                        <v-text-field  v-model="record.weight" class="disable-input" 
                          solo  prepend-inner-icon="mdi-weight-gram" :suffix="$vuetify.breakpoint.name === 'xs' ? 'g' : '公克 / g' " 
                          readonly disabled hint="透過長度來改變" persistent-hint></v-text-field>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="deep-orange--text font-weight-bold">水溫</label>
                        <v-text-field v-model="record.temp" class="disable-input"  suffix="℃" label="水溫" solo prepend-inner-icon="mdi-thermometer-alert"></v-text-field>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="deep-orange--text font-weight-bold">水質</label>
                        <v-select  v-model="record.water_quality" :items="water_quality"
                            menu-props="auto" label="選擇水質"
                            prepend-inner-icon="mdi-water-check" solo
                        ></v-select>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="deep-orange--text font-weight-bold">飼料</label>
                        <v-select  v-model="record.feed" :items="feed_category"
                            menu-props="auto" label="選擇飼料種類"
                            prepend-inner-icon="mdi-crowd" solo
                        ></v-select>
                    </v-col>
                    <v-col cols="6" md="3">
                        <label for="question_one" class="deep-orange--text font-weight-bold">品種</label>
                        <v-select v-model="record.breed" :items="shrimp_breed"
                            menu-props="auto" label="選擇蝦子品種" 
                            prepend-inner-icon="mdi-ballot" solo
                        ></v-select>
                    </v-col>
                </v-row>


                <v-divider class="mt-8"></v-divider>

                <v-subheader class="text-body-1 red--text" style="font-weight: bolder;" >
                    <v-icon color="red">mdi-pen-plus</v-icon>
                    &nbsp; 餵食量計算結果
                </v-subheader>
                <v-row>
                    <v-col cols="12 pt-8 text-center">
                        <h3 v-if="!is_re_computing">應投放的餵食量: {{ record.total_feed }}</h3>
                        <h3 v-else class="pink--text text--disabled" >
                          重新計算餵食量
                            <v-progress-linear
                              class="mt-4"
                              color="red lighten-2"
                              buffer-value="0"
                              stream
                            ></v-progress-linear>
                        </h3>
                    </v-col>
                </v-row>

                <v-divider class="mt-8"></v-divider>
            </v-col>

            <v-col cols="12">
                <div class="text-center">
                    <v-btn :width="btn_rwd_width" height="50px" color="error" class="ma-2" @click="deleteRecord" :disabled="is_re_computing">
                        <v-icon left>delete</v-icon>
                        刪除記錄
                    </v-btn>
                    <v-btn :width="btn_rwd_width" height="50px" color="success" class="ma-2" @click="updateRecord" :disabled="is_re_computing">
                        <v-icon left>edit</v-icon>
                        編輯紀錄
                    </v-btn>
                </div>
            </v-col>
      </v-row>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
    data(){
      return{
          record: {},
          water_quality : ["非常差", "差", "正常", "良好", "非常良好"],
          feed_category : ["A飼料", "B飼料", "C飼料", "D飼料"],
          shrimp_breed : ["白蝦", "草蝦", "泰國蝦", "明蝦"],
          record_name_List: ["測試人員", "子惠", "宛真", "育華", "珈錚", "姵彤"], // 紀錄者名稱列表

          is_re_computing: false, // 用來跑運算的Loading
          is_update: false, // 查看有無修改記錄
      }
    },
    computed: {
        // 按鈕RWD
        btn_rwd_width () { 
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "80%"
                case 'sm': return "60%"
                case 'md': return '50%'
                case 'lg': return '40%'
                case 'xl': return '30%'
            }
            return '100%' // 不用理會
        },

        // 欲監聽的數據
        watch_obj(){
          const { weight, temp, water_quality, feed, breed } = this.record
          return { weight, temp, water_quality, feed, breed }
        },
    },

    watch:{
      // 單純用來查看使用者有無修改資料，如有則提醒儲存修改
      record:{
        deep: true,
        handler(newVal, oldVal){
          // 避免起始載入資料時就觸發
          if( Object.keys(oldVal).length > 0 ){
            this.is_update = true;
          }
        }
      },
      watch_obj:{
        deep: true,
        async handler(newVal, oldVal){
          // 防止一開始進來跑一次(oldVal中的屬性都為 undefined)
          if( oldVal.weight ){
            // 跑載入畫面 (2秒)

            let { weight, temp, water_quality, feed, breed} = newVal;
            const obj = {
                weight: weight,
                temp: temp,
                water: water_quality,
                feed: feed,
                breed: breed,
            }

            let result = this.computeTotalFeed(obj) // 透過全域mixins(main.js裡)的methods 
            result = this.roundToTwo(result);  // 透過全域mixins(main.js裡)的methods，來執行四捨五入到小數第二位
            this.$set(this.record, 'total_feed', result)

            this.is_re_computing = true
            await new Promise(resolve => setTimeout(resolve, 2000))
            this.is_re_computing = false
          }
        }
      },
    },
    mounted(){
      this.readRecord();
    },

    methods:{
      readRecord(){
        // 讀取 API (顯示所有資料)
          axios.get(`/api/${this.$route.params.id}/`)
            .then(res => {
                  const data = res.data
                  // 處理時間，因為後端Django傳回來的資料為【時間格式】，必須轉換成【時間字串】
                  data.created_at = dayjs(data.created_at).format('YYYY/MM/DD HH:mm:ss')
                  data.updated_at = dayjs(data.updated_at).format('YYYY/MM/DD HH:mm:ss')
                  this.record = data // 將資料載入到 vue中
                  

              },
            ).catch(err=>{
                console.log(err) //沒接收到 印出ERROR
            })
      },
      updateRecord(){
          // 設定表單格式(用來傳給 POST)
          const formData = new FormData();
          const {name, length, weight, temp, water_quality, feed, breed, total_feed} = this.record
          formData.append("name", name);
          formData.append("length", length);
          formData.append("weight", weight);
          formData.append("temp", temp);
          formData.append("water_quality", water_quality);
          formData.append("feed", feed);
          formData.append("breed", breed);
          formData.append("total_feed", total_feed);
          axios.put(`/api/${this.$route.params.id}/`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
          })
          .then(response=>{
              this.$set(this.record, 'updated_at', dayjs().format('YYYY/MM/DD HH:mm:ss'))
              this.$swal.fire({
                icon: "success",
                  title: "更新成功",
              }).then(result=>{
                // 不管怎樣都把 is_udpate給關起來，不然會一直跳提醒
                if(result.isConfirmed){
                  this.is_update = false;
                }
                this.is_update = false;
              })
            })
            .catch((error)=> {
                //handle error
                if (error.response) {
                    console.log(error);
                }
            });
      },
      deleteRecord(){
        this.$swal.fire({
          icon: 'warning',
          title: '您正在刪除一筆資料',
          text: '確定要繼續執行刪除動作?',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '刪除',
        }).then(result=>{
            if(result.isConfirmed){
              axios.delete(`/api/${this.$route.params.id}/`)
                .then(response=> {
                    this.$router.push({name: 'feed_read'}) // 刪除後則返回到查詢頁面
                    this.$swal.fire({
                        icon: "success",
                        title: "刪除成功",
                    })
                })
                .catch((error)=> {
                    //handle error
                    if (error.response) {
                        console.log(error);
                    }
                });
            }
        })
      },

      // 透過 v-text-field的 change事件中所提供的參數(輸入值)，來進行重量運算
      changeWeight(len){
        const result = this.computeWeight(len)
        this.$set(this.record, 'weight', result)
      }
    },


    beforeRouteLeave (to, from , next) {
        if(!this.is_update){
            next(); // 代表資料已經被保存，則可以直接離開
        }else{
            // 透過 Object
            this.$swal.fire({
                title: '儲存提醒',
                text: '您還未保存資料，確定要離開該頁面嗎?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '直接離開',
                cancelButtonText: '取消',
            })
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                // 如果按了 Confirm按鈕
                if (result.isConfirmed) {
                    next()
                }
            })
        }
    },
}
</script>