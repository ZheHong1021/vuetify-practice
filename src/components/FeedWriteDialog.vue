<template>
  <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="dialog"
            persistent
        >
            <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary" dark>記錄步驟</v-toolbar>

                <v-card-text class="my-4">
                    <!-- 電腦版 -->
                    <v-stepper v-if="step_show_big"  v-model="step">
                        <v-stepper-header>
                            <!-- Step 01 -->
                            <v-stepper-step :complete="step >1" step="1" @click="step = 1">
                                計算重量
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <!-- Step 02 -->
                            <v-stepper-step :complete="step > 2" step="2" @click="step = 2">
                                計算餵食量
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <!-- Step 03 -->
                            <v-stepper-step :complete="step > 3" step="3" @click="step = 3">
                                最終結果
                            </v-stepper-step>
                            <v-divider></v-divider>
                        </v-stepper-header>

                        <v-stepper-items>
                            <!-- Step 01 -->
                            <v-stepper-content step="1">
                                <v-card  class="px-8 py-2 d-flex flex-column" height="300px">
                                    <div>
                                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">蝦子長度</label>
                                        <v-text-field label="填入蝦子長度" v-model="shrimp_len" type="number"  
                                            solo prepend-inner-icon="mdi-crowd" suffix="公分 / cm" persistent-hint
                                            :hint="`昨日紀錄: ${yesterday.length}公分 / cm`">
                                        </v-text-field>
                                        <div class="text-center">
                                            <!-- 在還沒填入資料前，不能點擊 -->
                                            <v-btn :color="showWieghtInfo ? 'blue-grey lighten-4' : 'success'" @click="computeWeight" 
                                                :disabled="shrimp_len.length <= 0" :loading="computeWeightLoading">
                                                {{ showWieghtInfo ? "重新計算" : "計算重量" }}
                                            </v-btn>
                                        </div>
                                    </div>

                                    <template v-if="showWieghtInfo">
                                        <label for="question_one" class="deep-orange--text font-weight-bold">蝦子重量</label>
                                        <v-text-field 
                                            class="disable-input" label="填入蝦子重量" v-model="shrimp_weight" 
                                            type="number" readonly disabled  solo prepend-inner-icon="mdi-weight-gram" 
                                            suffix="公克 / g" persistent-hint
                                            :hint="`昨日紀錄: ${yesterday.weight} 公克 / g`"></v-text-field>
                                        <div class="text-center mb-4">
                                            <v-btn color="error" @click="step = 2" :disabled="shrimp_weight.length <= 0">確認並進行下一步</v-btn>
                                        </div>
                                    </template>
                                </v-card>
                            </v-stepper-content>

                            <!-- Step 02 -->
                            <v-stepper-content step="2">
                                <v-card  class="px-8 py-4 d-flex flex-column" height="350px">
                                    <h3 class="d-flex align-center">
                                        <v-icon>mdi-weight-gram</v-icon>
                                        &nbsp;{{ shrimp_weight }} (公克/g)
                                    </h3>

                                    <v-divider class="my-4"></v-divider>

                                    <v-row>
                                        <v-col cols="6">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">水溫</label>
                                            <v-text-field  
                                                class="disable-input" label="填入水溫" v-model="select.temp" 
                                                type="number"  solo prepend-inner-icon="mdi-thermometer-alert"
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.temp}℃`"
                                                suffix="℃"></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">水質</label>
                                            <v-select  v-model="select.water" :items="water_quality"
                                                menu-props="auto" label="選擇水質"
                                                prepend-inner-icon="mdi-water-check" solo
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.water}`"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">飼料</label>
                                            <v-select  v-model="select.feed" :items="feed_category"
                                                menu-props="auto" label="選擇飼料種類"
                                                prepend-inner-icon="mdi-crowd" solo
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.feed}`"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">品種</label>
                                            <v-select  v-model="select.breed" :items="shrimp_breed"
                                                menu-props="auto" label="選擇蝦子品種" 
                                                prepend-inner-icon="mdi-ballot" solo
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.breed}`"
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                    <div class="text-center my-4">
                                        <v-btn color="blue-grey darken-1" class="white--text mx-2" @click="step = 1">回上一步驟</v-btn>
                                        <v-btn color="error" @click="computeTotalFeed" :disabled="!confirmSelect">確認並進行下一步</v-btn>
                                    </div>

                                </v-card>
                            </v-stepper-content>

                            <!-- Step 03 -->
                            <v-stepper-content step="3">
                                <v-card  class="px-8 py-2 d-flex flex-column" height="300px">
                                    <v-row>
                                        <v-col v-if="progress_Loading" cols="12" class="d-flex flex-column justify-center align-center">
                                            <h3 class="text-center mb-2">計算餵食量</h3>
                                            <v-progress-linear
                                                color="deep-purple accent-4"
                                                indeterminate
                                                rounded
                                                height="6"
                                            ></v-progress-linear>
                                        </v-col>

                                        <v-col v-else cols="12">
                                            <h3 class="text-center mb-2 text-h5 font-weight-bold">計算結果</h3>
                                            <h3 class="">餵食量為: {{ totalFeed }}</h3>

                                            <v-divider class="my-4"></v-divider>

                                            <div class="text-center">
                                                <v-btn color="blue-grey darken-1" class="white--text mx-2" @click="step = 2">回上一步驟</v-btn>
                                                <v-btn color="success" @click="saveToDataBase">
                                                    <v-icon left>save_as</v-icon>
                                                    儲存
                                                </v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-stepper-content>

                        </v-stepper-items>
                    </v-stepper>

                    <!-- 手機板 -->
                    <v-stepper v-else v-model="step" vertical>
                        <!-- Step 01 -->
                        <v-stepper-step :complete="step > 1" step="1" >
                            計算重量
                        </v-stepper-step>
                        <!-- Step 01 Content-->
                            <v-stepper-content step="1">
                                <v-card  class="pa-2 d-flex flex-column" height="300px">
                                    <div class="mb-4">
                                        <label for="question_one" class="teal--text text-darken-3 font-weight-bold">蝦子長度</label>
                                        <v-text-field label="填入蝦子長度" v-model="shrimp_len" type="number"  
                                            solo prepend-inner-icon="mdi-crowd" suffix="cm" persistent-hint
                                            :hint="`昨日紀錄: ${yesterday.length} 公分 / cm`">
                                        </v-text-field>
                                        
                                        <div class="text-center">
                                            <!-- 在還沒填入資料前，不能點擊 -->
                                            <v-btn :color="showWieghtInfo ? 'blue-grey lighten-4' : 'success'" @click="computeWeight" 
                                                :disabled="shrimp_len.length <= 0" :loading="computeWeightLoading">
                                                {{ showWieghtInfo ? "重新計算" : "計算重量" }}
                                            </v-btn>
                                        </div>
                                    </div>

                                    <template v-if="showWieghtInfo">
                                        <label for="question_one" class="deep-orange--text font-weight-bold">蝦子重量</label>
                                        <v-text-field 
                                            class="disable-input" label="填入蝦子重量" v-model="shrimp_weight" 
                                            type="number" readonly disabled  solo prepend-inner-icon="mdi-weight-gram" 
                                            suffix="公克 / g" persistent-hint
                                            :hint="`昨日紀錄: ${yesterday.weight} 公克 / g`"></v-text-field>
                                        <div class="text-center mb-4">
                                            <v-btn color="error" @click="step = 2" :disabled="shrimp_weight.length <= 0">確認並進行下一步</v-btn>
                                        </div>
                                    </template>
                                </v-card>
                            </v-stepper-content>

                        <!-- Step 02 -->
                        <v-stepper-step :complete="step >2" step="2">
                            計算餵食量
                        </v-stepper-step>
                        <!-- Step 02 Content -->
                        <v-stepper-content step="2">
                                <v-card  class="py-4 d-flex flex-column" height="100%">
                                    <h3 class="d-flex align-center">
                                        <v-icon>mdi-weight-gram</v-icon>
                                        &nbsp;{{ shrimp_weight }} (公克/g)
                                    </h3>

                                    <v-divider class="my-4"></v-divider>

                                    <v-row>
                                        <v-col cols="12">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">水溫</label>
                                            <v-text-field  
                                                class="disable-input" label="填入水溫" v-model="select.temp" 
                                                type="number"  solo prepend-inner-icon="mdi-thermometer-alert"
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.temp}℃`"
                                                suffix="℃"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">水質</label>
                                            <v-select  v-model="select.water" :items="water_quality"
                                                menu-props="auto" label="選擇水質"
                                                prepend-inner-icon="mdi-water-check" solo
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.water}`"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">飼料</label>
                                            <v-select  v-model="select.feed" :items="feed_category"
                                                menu-props="auto" label="選擇飼料種類"
                                                prepend-inner-icon="mdi-crowd" solo
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.feed}`"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12">
                                            <label for="question_one" class="deep-orange--text font-weight-bold">品種</label>
                                            <v-select  v-model="select.breed" :items="shrimp_breed"
                                                menu-props="auto" label="選擇蝦子品種" 
                                                prepend-inner-icon="mdi-ballot" solo
                                                persistent-hint :hint="`昨日紀錄: ${yesterday.breed}`"
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                    <div class="text-center my-4">
                                        <v-btn color="blue-grey darken-1" class="white--text mx-2 my-2" @click="step = 1">回上一步驟</v-btn>
                                        <v-btn color="error" @click="computeTotalFeed" :disabled="!confirmSelect">確認並進行下一步</v-btn>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                        <!-- Step 03 -->
                        <v-stepper-step :complete="step > 3" step="3">
                            最終結果
                        </v-stepper-step>
                        <!-- Step 03 -->
                        <v-stepper-content step="3">
                            <v-card  class="pa-2 d-flex flex-column" height="300px">
                                <v-row>
                                    <v-col v-if="progress_Loading" cols="12" class="d-flex flex-column justify-center align-center">
                                        <h3 class="text-center mb-2">計算餵食量</h3>
                                        <v-progress-linear
                                            color="deep-purple accent-4"
                                            indeterminate
                                            rounded
                                            height="6"
                                        ></v-progress-linear>
                                    </v-col>

                                    <v-col v-else cols="12">
                                        <h3 class="text-center mb-2 text-h5 font-weight-bold">計算結果</h3>
                                        <h3 class="">餵食量為: {{ totalFeed }}</h3>

                                        <v-divider class="my-4"></v-divider>

                                        <div class="text-center">
                                            <v-btn color="blue-grey darken-1" class="white--text mx-2" @click="step = 2">回上一步驟</v-btn>
                                            <v-btn color="success" @click="saveToDataBase">
                                                <v-icon left>save_as</v-icon>
                                                儲存
                                            </v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-stepper-content>
                    </v-stepper>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn text @click="closeDialog" color="primary" class="font-weight-bold">關閉</v-btn>
                </v-card-actions>
            </v-card>
            </template>
        </v-dialog>
</template>

<script>
export default {
    props:{
        dialog:{
            type: Boolean,
            default: false,
        },
        yesterday:{
            type: Object,
            default: ()=> ({}),
        }
    },
    data(){
        return{
            // 所有已被儲存的資料夾
            step: 1,

        // Step 01
            shrimp_len: "",
            shrimp_weight: "15",
            computeWeightLoading: false, // computeWeight事件所觸發的 Loading動畫
            showWieghtInfo: false, // 當填入完長度後，要進入計算重量的公式

        // Step 02
            
            select:{
                temp: "",
                water: "",
                feed: "",
                breed: "",
            },
            water_temp: "", // 水溫
            water_quality: [], // 水質(應為從資料庫中得到)
            feed_category: [], // 飼料種類
            shrimp_breed: [], // 品種
            confirmSelect: false, // 確認都填入資料了

        // Step 03
            progress_Loading: false, // 用來做畫面修飾的動畫
            totalFeed: 0, // 最後餵食量結果

        }
    },

    mounted(){
        this.water_quality = ["非常差", "差", "正常", "良好", "非常良好"];
        this.feed_category = ["A飼料", "B飼料", "C飼料", "D飼料"];
        this.shrimp_breed = ["白蝦", "草蝦", "泰國蝦", "明蝦"];
    },
    watch: {
        select:{
            deep: true,
            handler(newVal, oldVal){
                for(const select of Object.values(newVal)){
                    // 如果有選項是空的則不能點選按鈕
                    if(select === ""){
                        this.confirmSelect = false
                        return;
                    }
                }
                this.confirmSelect = true;
            }
        }
    },
    
    computed:{
      step_show_big(){
          switch (this.$vuetify.breakpoint.name) {
            case 'xs': return false;
            case 'sm': return false;
            case 'md': return true;
            case 'lg': return true;
            case 'xl': return true;
        }
        return true; // 不用理會(不想觸發 eslint的紅色提示)
      },

    // 係數取得 (水質、飼料種類、蝦子品種)
    water_index(){
        switch(this.select.water){
            case "非常差": return 2;
            case "差": return 3;
            case "正常": return 4;
            case "良好": return 5;
            case "非常良好": return 6;
        }
        return 0; // 不用理會(不想觸發 eslint的紅色提示)
    },
    feed_index(){
        switch(this.select.feed){
            case "非常差": return 2;
            case "差": return 2;
            case "正常": return 2;
            case "良好": return 2;
        }
        return 0; // 不用理會(不想觸發 eslint的紅色提示)
    },
    breed_index(){
        switch(this.select.breed){
            case "白蝦": return 2;
            case "草蝦": return 3;
            case "泰國蝦": return 4;
            case "明蝦": return 5;
        }
        return 0; // 不用理會(不想觸發 eslint的紅色提示)
    },

    },

    methods:{
        // 輸入完長度後，要計算重量的事件
        async computeWeight(){
            if (parseFloat(this.shrimp_len) <= 0 ){
                this.$swal.fire({
                    icon: "error",
                    title: "計算錯誤",
                    text: "您所填入的長度不能為空、零以及負數值",
                })
                return;
            }

            this.computeWeightLoading = true
            await new Promise(resolve => setTimeout(resolve, 1500))

            this.$swal.fire({
                icon: "success",
                title: "成功計算出重量",
                text: "如有填錯，可以再次填寫長度來重新計算",
            })
            this.computeWeightLoading = false
            this.showWieghtInfo = true

            // 這邊要帶公式(之後會加進來)
            this.shrimp_weight = parseFloat(this.shrimp_len) * 2 + (20 * 0.01) / 0.5  + 3
        },

        // 當資料都選完後，進行最後的步驟- 計算餵食量
        async computeTotalFeed(){
            this.step = 3; // 進入到第三步驟

            // 跑載入畫面 (2.5秒)
            this.progress_Loading = true
            await new Promise(resolve => setTimeout(resolve, 2500))
            this.progress_Loading = false

            const {temp} = this.select; // 解構
            const {shrimp_weight, water_index, feed_index, breed_index} = this; // 解構 (computed)
            this.totalFeed = (shrimp_weight * 1.5 - 3) + ( temp * 0.5 + water_index * 0.7 + feed_index * 0.3 + breed_index * 0.9)
            this.totalFeed = this.roundToTwo(this.totalFeed);  // 透過全域mixins(main.js裡)，來執行四捨五入到小數第二位
        },

        closeDialog(){
            // this.$swal.fire({
            //     icon: "warning",
            //     title: "儲存提醒",
            //     cancelButton: true,
            // })
            this.$emit('close')
        },

        saveToDataBase(){
            this.$swal.fire({
                icon: "success",
                title: "儲存成功",
            })
        },

    },
}
</script>


<style scoped>
/* 強制將 disabled的文字顏色做修改 */
    .disable-input >>> input {
        color: #000 !important;
    }
    
</style>

