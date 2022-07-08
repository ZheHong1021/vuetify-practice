<template>
    <div>
        <!-- 上傳檔案 -->
        <v-dialog v-model="import_Dialog" v-if="import_Dialog" width="900">
            <v-card min-height="500" elevation="10">
                <v-toolbar color="error" dark class="font-weight-bold">
                    上傳檔案
                    <v-spacer></v-spacer>
                    <v-btn @click="import_Dialog = false" text>
                        <v-icon>mdi-close-thick</v-icon>
                        關閉
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pa-8">
                    <v-form ref="uploadFileForm" v-model="uploadFormValid" class="d-flex align-center justify-center">
                        <v-file-input
                            v-model="fileInfo" show-size
                            chips outlined
                            prepend-inner-icon="mdi-file-excel"
                            prepend-icon="" accept=".xls,.xlsx"
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

                </v-card-text>
            </v-card>
        </v-dialog>


        <!-- 檔案列表 -->
        <v-card :width="rwd_width" class="mx-auto my-8 pa-4">
            <v-row>
                <v-col cols="12" class="d-flex align-center">
                    <v-chip 
                        color="light-blue darken-4" class="white--text mb-4 font-weight-bold" label style="cursor: pointer;">
                        <v-icon left color="white">file_download</v-icon>
                        紀錄列表
                    </v-chip>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="import_Dialog = true">
                        <v-icon left>mdi-file-plus</v-icon>
                        上傳檔案
                    </v-btn>
                </v-col>

                <v-col cols="12" >
                    <v-text-field v-model="search" clearable solo hide-details
                         label="搜尋欲查詢的檔案名稱" prepend-inner-icon="mdi-magnify"></v-text-field>
                    <v-card  min-height="500" class="pa-4 d-flex scrollbar">
                        <v-row>
                            <!-- 有資料時 -->
                            <template v-if="filter_file_list.length > 0">
                                <v-col cols="12" sm="6" md="4" lg="3" 
                                    v-for="file in filter_file_list" :key="file.id">
                                        <v-card  class="file d-flex flex-column align-center py-4" 
                                            @click="deleteFile(file.name)">
                                            <h3 class="text-subtitle-1 font-weight-bold">{{ file.name }}</h3>
                                            <v-icon class="my-4" color="green darken-2" size="64">description</v-icon>
                                        </v-card>
                                </v-col>
                            </template>

                            <!-- 查無資料 -->
                            <template v-else>
                                <v-col cols="6" class="ma-auto">
                                    <v-card  class="file d-flex flex-column align-center py-4" >
                                        <h3 class="text-subtitle-1 font-weight-bold">查無資料</h3>
                                        <v-icon class="my-4" color="green darken-2" size="64">description</v-icon>
                                    </v-card>
                                </v-col>
                            </template>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

        </v-card>
    </div>

</template>

<script>
import axios from 'axios';
export default {
    name: "file_download",
    data(){
        return{
            file_list: [], // 所有已被儲存的資料夾
            dialog: false,
            search: "", // 搜尋值

            import_Dialog: false,

            uploadFormValid: '',
            fileInfo: [],
            uploadIsLoading: false,
        }
    },
    computed:{
      rwd_width () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return "100%"
          case 'sm': return "90%"
          case 'md': return '80%'
          case 'lg': return '70%'
          case 'xl': return '60%'
        }
      },

        filter_file_list(){
            return this.file_list.filter( (file)=>  file.name.indexOf(this.search) !== -1 ) // indexOf來查詢字串中有無特定值。如無會回傳『-1』
        }

    },
    async mounted(){  // 網頁載入時，一開始就載入
        try{
            const response = await axios.get('/api/fileList/');
            this.file_list = response.data["data"]
        }
        catch(err){
            console.log(err);
        }
    },

    methods:{
        downloadFile(file){
            window.open(`http://127.0.0.1:8000/api/downloadFile/?filename=${file}.xlsx`)
        },
        deleteFile(file){
            this.$swal.fire({
                icon: "warning",
                title: "刪除警告",
                text: "您目前正在刪除一個檔案",
                showCancelButton: true,
                confirmButtonText: "確定",
                cancelButtonText: "取消",
            }).then( async (result)=>{
                if(result.isConfirmed){ // 假設點擊『確定』
                    try{
                        const formData = new FormData()
                        formData.append("file", file)
                        const response = await axios.post('/api/deleteFile/', formData);
                        this.$swal.fire("刪除成功", "", "success")
                        this.file_list = this.file_list.filter( item=> item.name !== file ) // 將被刪除的檔案從陣列清除
                    }catch(err){
                        this.$swal.fire("刪除失敗", "", "error")
                    }
                }
            } )
        },


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
                    this.uploadIsLoading = false;
                    const statusCode = res.status
                    const data = res.data.data
                    if(statusCode === 200){
                        this.$swal.fire(res.data.message, "", "success")
                        this.file_list.unshift(data) // 在陣列最前新增
                    }
                })
                .catch(err=>{
                    const msg = err.response.data["message"]
                    this.uploadIsLoading = false;
                    this.$swal.fire("檔案上傳失敗!", msg, "warning")
                })
            }, 1500);
          }
        },
    }
}
</script>

<style lang="scss" scoped>
    .download_link{
        cursor: pointer;

        &:hover label{
            color: #fa0;
            border-bottom: 2px solid #fa0;
        }
    }

</style>
