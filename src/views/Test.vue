<template>
  <div>
        <h3 class="ma-4 text-h5 font-weight-bold">蝦苗病毒檢測</h3>

        <v-divider></v-divider>
        <v-container>
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

                        <!-- 廠池選擇 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3" v-if="filter_idx === filters[0] || filter_idx === filters[2]">
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >廠池</v-chip>
                            <v-select @change="changeFactory" v-model="position_idx" hide-details
                                :items="positions" label="請選擇廠池" dense solo></v-select>
                        </v-col>

                        <!-- 測試項目 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3" v-if="filter_idx === filters[0] || filter_idx === filters[2]">
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >測試項目</v-chip>
                            <v-select v-model="project_idx" hide-details
                                :items="projects" label="請選擇測試項目" dense solo
                                no-data-text="尚未選擇廠池"></v-select>
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
                                    @change="changeDatePicker"
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
                                    @change="changeDatePicker"
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
                    <v-row v-if="search_loading || test_result.length === 0">
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
                                            <v-card color="orange lighten-5">
                                                <v-card-title>
                                                    {{result.item}}
                                                </v-card-title>
                                                <v-card-text  class="d-flex flex-column justify-center align-center">
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <v-card color="#130f40" min-width="100%">
                                                                <v-card-text class="yellow--text font-weight-bold">{{result.output[0] ? result.output[0] : "無檢驗結果" }}</v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <v-card color="#130f40" min-width="100%">
                                                                <v-card-text class="yellow--text font-weight-bold">{{result.output[1] ? result.output[1] : "無檢驗結果" }}</v-card-text>
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
                        <v-img height="300" :src="dialog_info.img"></v-img>
                        <div>
                            <v-card-title>
                                備註
                            </v-card-title>
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

            positions: ["2B#2901", "2B#1905", "1903", "A2", "1101"],
            position_idx: null,
            projects: ["EHP", "EMS", "WSSV"],
            project_idx: null,
            start_date_idx: null,
            start_date_menu: false,
            end_date_idx: null,
            end_date_menu: false,
            ResultJson: [],

            dialog: false,
            dialog_info: {
                remark: '',
                img: '',
            },
            search_loading: false,
        }
    },

    computed:{
        test_result(){
            const demo = []
            for (const data of this.ResultJson ){
                for(const item of data.items){
                    const obj = {
                        id: uuidv4(), // 特別加裝一個 uuid
                        name: item.name,
                        result: item.result,
                        date: data.date,
                        method: data.method,
                        remark: data.remark,
                    }
                    demo.push(obj)
                }
            }
            return demo.reverse()
        }
    },

    async created(){
        this.searchAll()
    },

    methods:{
        searchAll(){ // 搜尋全部(不限日期)
            try{
                axios.get('/api/read-excel/')
                    .then(res=>{
                        this.ResultJson = res.data.data
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
        changeDatePicker(){

        },

        goSearch(){ // 搜尋特定結果(限定日期區間 or 廠號)
            // if(!this.start_date_idx || !this.end_date_idx){
            //     this.$swal.fire("查詢失敗", "請確實填入查詢條件", "error")
            // }else{
                this.search_loading = true;
                try{
                    axios.get('/api/read-excel/',{
                        params:{
                            start_date: this.start_date_idx,
                            end_date: this.end_date_idx,
                            position: this.position_idx,
                        }
                    })
                    .then(res=>{
                        setTimeout(() => {
                            this.search_loading = false;
                            this.$swal.fire("查詢成功", "", "success")
                            this.ResultJson = res.data.data
                        }, 1000);
                    })
                }catch(err){
                    console.log(err);
                }
            // }
        },

        readProjectTest(test){
            // this.dialog_info.remark = test.remark
            // this.dialog_info.img = test.img;
            this.dialog = true;

        },
    }
}
</script>

<style>

</style>