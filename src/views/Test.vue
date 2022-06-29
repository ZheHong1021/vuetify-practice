<template>
  <div>
        <h3 class="ma-4 text-h5 font-weight-bold">蝦苗病毒檢測</h3>

        <v-divider></v-divider>
        <v-container class="px-8 py-4 px-lg-12 py-lg-8">
            <v-card>
                <v-card-title class="font-weight-bold">篩選查詢條件</v-card-title>
                <v-card-text>
                    <v-row class="my-2 d-flex justify-center align-center">
                        <!-- 下拉選單 -->
                        <v-col class="mx-4" cols="12" >
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >查詢內容</v-chip>
                            <v-select @change="changeFilter" v-model="filter_idx" hide-details
                                :items="filters" label="請選擇欲查詢內容" dense solo></v-select>
                        </v-col>

                        <!-- 取樣地點 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3" v-if="filter_idx === filters[0] || filter_idx === filters[2]">
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >取樣地點</v-chip>
                            <v-select @change="changeFactory" v-model="position_idx" hide-details
                                :items="position_SET" label="請選擇取樣地點" dense solo></v-select>
                        </v-col>

                        <!-- 池號 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3" v-if="filter_idx === filters[0] || filter_idx === filters[2]">
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >池號</v-chip>
                            <v-select v-model="project_idx" hide-details
                                :items="projects" label="請選擇池號" dense solo
                                no-data-text="尚未選擇取樣地點"></v-select>
                        </v-col>

                        <!-- 日期區間 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3" v-if="filter_idx === filters[1] || filter_idx === filters[2]">
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
                        <v-col class="mx-4" cols="6" md="4" lg="3" v-if="filter_idx === filters[1] || filter_idx === filters[2]">
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
                            <v-btn color="primary" @click="goSearch" large class="text-h6">查詢</v-btn>
                            <!-- <v-btn color="gray" @click="searchAll" large class="text-h6">查詢全部</v-btn> -->
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>


            
            <v-card elevation="4" class="my-8">
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
                            <div  class="text-center mb-8">
                                <h6 class="text-h6 font-weight-bold mb-2">載入資料中...</h6>
                                <v-progress-circular
                                    :width="3"
                                    color="green"
                                    indeterminate
                                ></v-progress-circular>
                            </div>
                        </v-col>
                    </v-row>

                    <v-row v-else-if="test_result.length > 0 && !search_loading">
                        <v-col cols="12" sm="6" lg="4" v-for="test in test_result" :key="test.id">
                            <v-card min-height="350" @click="readProjectTest(test)">
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
                    </v-row>

                    <v-row v-else>
                        <v-col cols="12">
                            <div  class="text-center mb-8">
                                <h6 class="text-h6 font-weight-bold mb-2">查無資料</h6>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-dialog
                v-model="dialog"
                v-if="dialog"
                width="900">
                    <v-card class="mx-auto ">
                        <v-img height="300" src="https://images.unsplash.com/photo-1510941781581-59620dc6bfdd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"></v-img>
                        <!-- <v-img height="300" :src="dialog_info['images']['EHP']"></v-img> -->
                        <div>
                            <v-card-title>檢驗方法</v-card-title>
                            <v-card-text>
                                <v-textarea
                                    background-color="blue lighten-5"
                                    solo readonly
                                    :value="dialog_info.method"
                                ></v-textarea>
                            </v-card-text>
                        </div>
                        <div>
                            <v-card-title>備註</v-card-title>
                            <v-card-text>
                                <v-textarea
                                    background-color="blue lighten-5"
                                    solo readonly
                                    :value="dialog_info.remark"
                                ></v-textarea>
                            </v-card-text>
                        </div>

                        <v-divider class="mx-4"></v-divider>
                    </v-card>
            </v-dialog>

        </v-container>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
export default {
    data(){
        return{
            filters: ["只查詢廠池", "只查詢特定日期區間", "以上均查詢"],
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
        }
    },

    computed:{
        test_result(){
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
            return demo.reverse()
        },

        position_SET(){ // 將重複的值清除
            return [...new Set(this.positions)]
        }
    },

    async created(){
        await this.searchAll()
    },

    methods:{
        searchAll(){ // 搜尋全部(不限日期)
            this.search_loading = true;
            try{
                axios.get('/api/read-excel/')
                    .then(res=>{
                        this.ResultJson = res.data.data
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

<style>

</style>