<template>
  <div>
        <h3 class="ma-4 text-h5 font-weight-bold">蝦苗病毒檢測</h3>

        <v-divider></v-divider>
        <v-container>
            <v-card>
                <v-card-title class="font-weight-bold">篩選查詢條件</v-card-title>
                <v-card-text>
                    <v-row class="my-2 d-flex justify-center align-center">
                        <!-- 廠池選擇 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3">
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >廠池</v-chip>
                            <v-select @change="changeFactory" v-model="factory_idx" hide-details
                                :items="factorys" label="請選擇廠池" dense solo></v-select>
                        </v-col>

                        <!-- 測試項目 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3">
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >測試項目</v-chip>
                            <v-select v-model="project_idx" hide-details
                                :items="projects" label="請選擇測試項目" dense solo
                                no-data-text="尚未選擇廠池"></v-select>
                        </v-col>

                        <!-- 日期區間 -->
                        <v-col class="mx-4" cols="6" md="4" lg="3">
                            <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" >日期區間</v-chip>
                            <v-menu
                                v-model="date_menu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="date_idx"
                                        label="請選擇欲紀錄日期"
                                        prepend-inner-icon="mdi-calendar"
                                        readonly v-bind="attrs" v-on="on"
                                        solo hide-details range
                                    ></v-text-field>
                                </template>

                                <v-date-picker
                                    locale="zh-tw"
                                    v-model="date_idx"
                                    @input="date_menu = false"
                                    @change="changeDatePicker"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" class="d-flex justify-center mt-8">
                            <v-btn color="primary" @click="goSearch" large class="text-h6">查詢</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>


            
            <v-card elevation="4" class="my-8">
                <v-card-title class="font-weight-bold">蝦類病毒檢驗記錄表</v-card-title>
                <v-card-text>
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

                    <v-row v-else>
                        <v-col cols="12" md="6" lg="4" 
                            v-for="test in test_result" :key="test.id">
                            <v-card elevation="4" class="my-4" color="orange lighten-5"
                                @click="readProjectTest(test)">
                                <!-- 日期 -->
                                <v-card-title class="font-weight-bold">
                                    <v-chip class="text-subtitle-1 mr-2 font-weight-bold" color="black" label text-color="white">取樣時間</v-chip>
                                    {{ test.date }}
                                </v-card-title>
                                <v-card-text>
                                    <v-row >
                                        <!-- 廠池 -->
                                        <v-col cols="12" md="6" class="d-flex align-center">
                                            <v-chip class="text-subtitle-1" color="blue" label text-color="white" small>廠池</v-chip>
                                            <span class="ml-2 text-h6 font-weight-bold">{{ test.factory }}</span>
                                        </v-col>

                                        <!-- 測試項目 -->
                                        <v-col cols="12" md="6" class="d-flex align-center">
                                            <v-chip class="text-subtitle-1" color="blue" label text-color="white" small>測試項目</v-chip>
                                            <span class="ml-2 text-h6 font-weight-bold">{{ test.project }}</span>
                                        </v-col>
                                    </v-row>

                                    <!-- 檢測結果 -->
                                    <v-row class="pa-4 pa-lg-8">
                                        <v-col cols="12" md="6">
                                            <v-card class="pa-2 pa-lg-4 d-flex flex-column justify-center align-center" color="green lighten-4">
                                                <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" small>檢驗結果一</v-chip>
                                                <h3 class="text-h6 font-weight-bold">{{ test.result_one }}</h3>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-card class="pa-2 pa-lg-4 d-flex flex-column justify-center align-center" color="green lighten-4">
                                                <v-chip class="text-subtitle-1" color="green darken-2" label text-color="white" small>檢驗結果二</v-chip>
                                                <h3 class="text-h6 font-weight-bold">{{ test.result_two }}</h3>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-img height="200" :src="test.img"></v-img>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
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
export default {
    data(){
        return{
            factorys: ["2B#2901", "2B#1905", "1903", "A2", "1101"],
            factory_idx: null,
            projects: ["EHP", "EMS", "WSSV"],
            project_idx: null,
            date_idx: null,
            date_menu: false,
            
            test_result: [
                {id: 'test_01', date: '2022/05/30', factory: '2B#1905', project: 'EHP', result_one: '未檢出', result_two: '未檢出', remark: '備註01', img: 'https://images.unsplash.com/photo-1510941781581-59620dc6bfdd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'},
                {id: 'test_02', date: '2022/05/27', factory: '進口種蝦', project: 'EHP', result_one: '未檢出', result_two: '未檢出', remark: '以隨機抽樣方式檢驗，若本檢驗報告顯示二重複中有一檢出病毒為該池部分蝦子已有感染。', img: 'https://images.unsplash.com/photo-1516741449206-2db1f9b79d10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'},
                {id: 'test_03', date: '2022/05/23', factory: '高峰A8', project: 'EHP', result_one: '非常輕微感染', result_two: '非常輕微感染', remark: '備註03', img: 'https://images.unsplash.com/photo-1518960799632-ff8984f6a298?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736&q=80'},
                {id: 'test_04', date: '2022/05/23', factory: '高峰A10', project: 'EHP', result_one: '非常輕微感染', result_two: '未檢出', remark: '備註04', img: 'https://images.unsplash.com/photo-1617717290456-813af868f96a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80'},
            ],

            dialog: false,
            dialog_info: {
                remark: '',
                img: '',
            },

            search_loading: false,

        }
    },

    methods:{
        changeFactory(){
            
        },
        changeDatePicker(){

        },

        goSearch(){

            // if(!this.factory_idx && !this.project_idx && !this.date_idx){
            //     this.$swal.fire("查詢失敗", "請確實填入查詢條件", "error")
            // }else{
                this.search_loading = true;
                setTimeout(() => {
                    this.search_loading = false;
                    
                    this.$swal.fire("查詢成功", "", "success")
                }, 1500);
            // }
        },

        readProjectTest(test){
            this.dialog_info.remark = test.remark
            this.dialog_info.img = test.img;
            this.dialog = true;

        },
    }
}
</script>

<style>

</style>