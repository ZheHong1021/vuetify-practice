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
                        <v-text-field v-model="record.length" class="disable-input" solo  prepend-inner-icon="mdi-ruler" :suffix="$vuetify.breakpoint.name === 'xs' ? 'cm' : '公分 / cm'"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <label for="question_one" class="deep-orange--text font-weight-bold">重量</label>
                        <v-text-field v-model="record.weight" class="disable-input" solo  prepend-inner-icon="mdi-weight-gram" :suffix="$vuetify.breakpoint.name === 'xs' ? 'g' : '公克 / g' "></v-text-field>
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

          is_re_computing: false,
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
    },

    watch:{
      record:{
        deep: true,
        async handler(newVal, oldVal){
          if( Object.keys(oldVal).length > 0 ){

            // 跑載入畫面 (2.5秒)
            this.is_re_computing = true
            await new Promise(resolve => setTimeout(resolve, 2500))
            this.is_re_computing = false

          }
        }
      }
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
          .then(response=> {
              this.readRecord();
                this.$swal.fire({
                    icon: "success",
                    title: "更新成功",
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
    }
}
</script>