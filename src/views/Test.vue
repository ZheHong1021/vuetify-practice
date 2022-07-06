<template>
  <div>
        <h3 class="ma-4 text-h5 font-weight-bold d-flex align-center">
            <img width="35" height="35" :src="require(`@/assets/images/shrimp.svg`)" alt="">
            <span class="ml-1">蝦苗病毒檢測</span>
        </h3>
        <v-divider></v-divider>
        <div class="bg-wrapper">
            
            <v-form ref="uploadFileForm" v-model="uploadFormValid" class="d-flex align-center justify-center">
                <v-file-input
                    v-model="fileInfo"
                    show-size
                    chips
                    outlined
                    prepend-inner-icon="mdi-file-excel"
                    prepend-icon=""
                    accept=".xls,.xlsx"
                    :disabled="uploadIsLoading"
                    :loading="uploadIsLoading"
                    placeholder="請將欲使用的報表載入"
                    hide-details>
                    <template v-slot:selection="{ text }">
                    <v-chip color="deep-purple accent-4" dark label small>{{ text }}</v-chip>
                </template>
                </v-file-input>
            </v-form>
            <v-btn class="mx-2" color="success" @click="uploadFile()">上傳</v-btn>


            <v-container class="px-4 py-4 px-md-8 px-lg-12 py-lg-8 ">
                <!-- 篩選 -->
                <v-card color="green lighten-5" elevation="10">
                    <v-card-title class="font-weight-bold">篩選查詢條件</v-card-title>
                    <v-card-text>
                        <!-- 下拉選單 -->
                        <div style="width: 30%;" class="mx-auto">
                            <v-chip class="text-subtitle-1" color="black" label text-color="white" >查詢內容</v-chip>
                            <v-select @change="changeFilter" v-model="filter_idx" hide-details
                                :items="filters" label="請選擇欲查詢內容" dense solo></v-select>
                        </div>
                        <v-row class="my-2 d-flex justify-center align-center">

                            
                            <!-- 取樣地點 -->
                            <v-col class="mx-4" cols="6" md="4"  v-if="filter_idx === filters[0] || filter_idx === filters[2]">
                                <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >取樣地點</v-chip>
                                <v-select @change="changeFactory" v-model="position_idx" hide-details
                                    :items="position_SET" label="請選擇取樣地點" dense solo></v-select>
                            </v-col>

                            <!-- 池號 -->
                            <v-col class="mx-4" cols="6" md="4"  v-if="filter_idx === filters[0] || filter_idx === filters[2]">
                                <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >池號</v-chip>
                                <v-select v-model="project_idx" hide-details
                                    :items="projects" label="請選擇池號" dense solo
                                    no-data-text="尚未選擇取樣地點"></v-select>
                            </v-col>

                            <!-- 日期區間 -->
                            <v-col class="mx-4" cols="6" md="4"  v-if="filter_idx === filters[1] || filter_idx === filters[2]">
                                <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >起始日期</v-chip>
                                <v-menu
                                    v-model="start_date_menu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="start_date_idx"
                                            label="請選擇起始日期"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly v-bind="attrs" v-on="on"
                                            solo hide-details range
                                        ></v-text-field>
                                    </template>

                                    <v-date-picker
                                        locale="zh-tw"
                                        v-model="start_date_idx"
                                        @input="start_date_menu = false"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>

                            <!-- 日期區間 -->
                            <v-col class="mx-4" cols="6" md="4"  v-if="filter_idx === filters[1] || filter_idx === filters[2]">
                                <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >結束日期</v-chip>
                                <v-menu
                                    v-model="end_date_menu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="end_date_idx"
                                            label="請選擇欲結束日期"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly v-bind="attrs" v-on="on"
                                            solo hide-details range
                                        ></v-text-field>
                                    </template>

                                    <v-date-picker
                                        locale="zh-tw"
                                        v-model="end_date_idx"
                                        @input="end_date_menu = false"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>

                            <v-col cols="12" class="d-flex justify-center mt-8">
                                <v-btn 
                                    color="primary" 
                                    @click="goSearch" 
                                    :disabled="search_loading"
                                    large class="text-h6 font-weight-bold">
                                        <v-icon left large>mdi-magnify</v-icon>
                                        查詢
                                </v-btn>
                                
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                

                <!-- 紀錄結果 -->
                <v-card elevation="10" class="my-8" >
                    <v-card-title class="font-weight-bold">
                        蝦類病毒檢驗記錄表
                        <v-spacer></v-spacer>
                        <v-btn color="orange" @click="ResultJson.reverse()">
                            <v-icon>mdi-swap-vertical-bold</v-icon>
                            日期順序
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <!-- 開始載入資料 -->
                        <v-row v-if="search_loading">
                            <v-col cols="12">
                                <div class="text-center mb-8">
                                    <h6 class="text-h6 font-weight-bold mb-2">載入資料中...</h6>
                                    <v-progress-circular
                                        :width="3"
                                        color="green"
                                        indeterminate
                                    ></v-progress-circular>
                                </div>
                            </v-col>
                        </v-row>

                        <!-- 讀取資料 -->
                        <v-row v-else-if="test_result.length > 0 && !search_loading">
                            <v-col cols="12" sm="6" lg="4" v-for="test in showPageData" :key="test.id">
                                <v-card min-height="350" @click="readProjectTest(test)" elevation="10" class="hover-card">
                                    <v-card-title class="font-weight-bold">
                                        <v-chip class="text-subtitle-1 mr-2 font-weight-bold" color="black" label text-color="white">取樣地點</v-chip>
                                        {{ test.name }}

                                        <v-spacer></v-spacer>
                                        <v-chip class="text-subtitle-2 font-weight-bold my-2" 
                                            color="primary" small label text-color="white">
                                            取樣時間: {{ test.date["sample"] }}
                                        </v-chip>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" md="6" v-for="result in test.result" :key="result.item">
                                                <v-card color="#dff9fb">
                                                    <v-card-title>
                                                        {{result.item}}
                                                    </v-card-title>
                                                    <v-card-text  class="d-flex flex-column justify-center align-center">
                                                        <v-row>
                                                            <v-col cols="6">
                                                                <v-card color="#130f40" min-width="100%">
                                                                    <v-card-text class="text-center yellow--text font-weight-bold">{{result.output[0] ? result.output[0] : "尚未檢驗" }}</v-card-text>
                                                                </v-card>
                                                            </v-col>
                                                            <v-col cols="6">
                                                                <v-card color="#130f40" min-width="100%">
                                                                    <v-card-text class="text-center yellow--text font-weight-bold">{{result.output[1] ? result.output[1] : "尚未檢驗" }}</v-card-text>
                                                                </v-card>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12">
                                <v-pagination
                                    v-model="page"
                                    :length="page_length"
                                    color="black"
                                ></v-pagination>
                            </v-col>
                        </v-row>

                        <!-- 查無資料 -->
                        <v-row v-else>
                            <v-col cols="12">
                                <div  class="text-center mb-8">
                                    <h6 class="text-h6 font-weight-bold mb-2">查無資料</h6>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <!-- 單一紀錄結果 -->
                <v-dialog v-model="dialog" v-if="dialog" width="900">
                        <v-card class="pa-4">
                            <div>
                                <h3>檢驗方法</h3>
                                    <v-textarea auto-grow height="auto" rows="1"
                                        background-color="light-blue lighten-5"
                                        solo readonly :value="dialog_info.method"
                                    ></v-textarea>
                            </div>
                            <div>
                                <h3>備註</h3>
                                    <v-textarea auto-grow height="auto" rows="1"
                                        background-color="light-blue lighten-5"
                                        solo readonly :value="dialog_info.remark"
                                    ></v-textarea>
                            </div>

                            <!-- 圖片 -->
                            <v-card elevation="5">
                                <v-card-title>
                                    <v-chip color="indigo" label class="white--text font-weight-bold">圖片</v-chip>
                                </v-card-title>
                                <v-card-text>
                                    <v-row class="pa-0 ma-0">
                                        <v-col cols="12" md="6" v-for="image, key in dialog_info.images" :key="key">
                                            <expandable-image v-if="image" 
                                                :close-on-background-click="true"
                                                :src="require(`@/assets/images/test_result/${image}`)"/>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-card>
                </v-dialog>
            </v-container>
        </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import VueExpandableImage from 'vue-expandable-image'
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
export default {
    components:{
        VueExpandableImage
    },
    data(){
        return{
            uploadFormValid: '',
            fileInfo: [],
            uploadIsLoading: false,

            filters: ["只篩選廠池", "只篩選日期區間", "以上均篩選"],
            filter_idx: null,

            positions: [],
            position_idx: null,

            projects: ["EHP", "EMS", "WSSV"],
            project_idx: null,

            start_date_idx: null,
            start_date_menu: false,
            end_date_idx: null,
            end_date_menu: false,
            ResultJson: [],

            dialog: false,
            dialog_info: {},
            search_loading: false,

            page: 1,
            pageRow: 6,
        }
    },

    computed:{
        test_result(){ // 將從後端得到的資料進行處理(主要是用來顯示)
            const demo = []
            const position_len = this.positions.length // 代表第一次執行。要將取樣地點給列出來
            for (const data of this.ResultJson ){
                if(position_len === 0 ){
                    this.positions = [...this.positions, ...data.positions] // 合併
                }
                for(const item of data.items){
                    const obj = {
                        id: uuidv4(), // 特別加裝一個 uuid
                        name: item.name,
                        result: item.result,
                        ...data
                    }
                    demo.push(obj)
                }
            }
            return demo
        },


        showPageData(){ // 追加了換頁功能，因此可以將上面『test_result』的內容(陣列)進行切片來決定要顯示哪幾筆資料
            const {page, pageRow} = this
            // 第一頁: [0:6] → 陣列0~5 → 共六筆
            // 第二頁: [6:12] → 陣列6~11 → 共六筆
            // 切片[ (頁數-1)*單頁數量 : 頁數*單頁數量 ]
            return this.test_result.slice( (page-1)*pageRow, page*pageRow)
        },

        page_length(){ // 總頁數( 資料總筆數 / 單頁顯示筆數 + 1) 
            const {test_result, pageRow} = this
            // 如果筆數剛好為 11，頁數應該為 『 11 / 6 + 1 』 = 2頁
            // 如果筆數剛好為 12，頁數應該為 『 12 / 6 + 0 』 = 2頁
            // 如果筆數剛好為 13，頁數應該為 『 13 / 6 + 1 』 = 3頁
            const is_add = ((test_result.length % pageRow) === 0) ? 0 : 1 
            return parseInt(test_result.length / pageRow) + is_add
        },

        position_SET(){ // 將重複的值清除
            return [...new Set(this.positions)]
        }
    },

    async created(){
        await this.searchAll()
    },

    methods:{
        // https://blog.csdn.net/qq_39569480/article/details/109309111
        uploadFile(replace){ // 上傳檔案 (replace代表欲上傳的檔案不存在，沒有取代問題。預設 False)
          if(this.$refs.uploadFileForm.validate()){
            this.uploadIsLoading = true; // Loading
            let formData = new window.FormData() 
            formData.append("file", this.fileInfo)
            if(replace){
              formData.append("replace", true)
            }
            setTimeout(() => {

                axios.post("/api/uploadFile/", formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(res=>{
                    const statusCode = res.status
                    this.uploadIsLoading = false;
                    if(statusCode === 200){
                        this.$swal.fire(res.data.message, "", "success")
                    }
                })
                .catch(err=>{
                    this.uploadIsLoading = false;
                    this.$swal.fire("檔案上傳失敗!", "", "warning")
                })
              
            }, 1500);
          }

        },

        importAjax(data){
          return axios.post("/api/uploadFile/", data, {
            headers: {'Content-Type': 'multipart/form-data'}
          })
        },

        searchAll(){ // 搜尋全部(不限日期)
            this.search_loading = true;
            try{
                axios.get('/api/read-excel/')
                    .then(res=>{
                        this.ResultJson = res.data.data
                        this.ResultJson.sort((n1, n2)=> n1.date.sample < n2.date.sample ? 1 : -1)
                        this.search_loading = false;
                    })
            }catch(err){
                console.log(err);
            }
        },

        changeFilter(){
            this.position_idx = null;
            this.start_date_idx = null;
            this.end_date_idx = null;
        },

        changeFactory(){
        },

        async goSearch(){ // 搜尋特定結果(限定日期區間 or 廠號)
            // 1.只查詢日期區間
            // 2.只查詢特定取樣地點
            // 3.同時查詢日期區間及取樣地點
            const rule_one = !this.position_idx
            const rule_two = !this.start_date_idx || !this.end_date_idx
            const rule_three = rule_one || rule_two
            const search = this.filter_idx === this.filters[0] ? rule_one : this.filters[1] ? rule_two : rule_three

            this.ResultJson = [] // 清空資料

            if(search){ // 如果條件不符合則代表查詢失敗(True)
                this.$swal.fire("查詢失敗", "請確實填入查詢條件", "error")
            }else{
                this.search_loading = true;
                try{
                    const params = {
                        start_date: this.start_date_idx,
                        end_date: this.end_date_idx,
                        position: this.position_idx,
                    }
                    const response = await axios.get('/api/read-excel/', { params: params } )
                    this.$swal.fire("查詢成功", "", "success")
                    this.search_loading = false;
                    this.ResultJson = response.data.data
                    this.ResultJson.sort((n1, n2)=> n1.date.sample < n2.date.sample ? 1 : -1)
                }catch(err){
                    this.$swal.fire("查詢失敗", err, "error")  
                    this.search_loading = false;
                    this.ResultJson = [] 
                }
            }
        },

        readProjectTest(test){
            this.dialog_info = test
            this.dialog = true;
        },
    }
}
</script>

<style scoped>

    .bg-wrapper{
        background: rgb(238,174,202);
        background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
    }

    body > .expandable-image.expanded {
        background: rgb(238,174,202);
        background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
    }


    body > .expandable-image.expanded > img {
        width: 100%;
        height: auto;
        max-width: 1200px;
        max-height: 100%;
        object-fit: contain;
        margin: 0 auto;
    }

    .hover-card{
        transition: .5s;
        position: relative;
    }


    .hover-card::after{
        content: "點擊查看";
        opacity: 0;
        visibility: hidden;
        background: #000;
        color: #fff;
        border-radius: 10px;
        position: absolute;
        bottom: 0%;
        left: 50%;
        transform: translate(-50%, -0%);
        padding: 0.5rem 0.75rem;
        font-size: 1.15rem;
        font-weight: bolder;
        transition: 0.5s;
    }


    .hover-card:hover{
        transform: translateY(-15px);
        background-color: #f7f1e3;
    }

    .hover-card:hover::after{
        visibility: visible;
        opacity: 1;
        bottom: 5%;
        left: 50%;
        transform: translate(-50%, -5%);
    }

</style>