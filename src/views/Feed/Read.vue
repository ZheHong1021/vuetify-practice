<template>
  <div>
      <h1>查詢</h1>
          <v-data-table
            :headers="table.headers"
            :items="record_all"
            :page.sync="table.page"
            class="elevation-1"
            :items-per-page="table.itemsPerPage"
            @page-count="table.pageCount = $event"
            :search="table.search"
            hide-default-footer
            @click:row="handleClick"
            :sort-by="['created_at']"
            :sort-desc="[true]"
          >
            <template v-slot:top>
              <v-text-field v-model="table.search" label="搜尋" class="mx-4"
                append-icon="mdi-magnify"></v-text-field>
            </template>
          </v-data-table>


  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
    data(){
      return{
        record_all: [], // 從資料庫中所得到的所有資料


      // data-table中所有會使用的 props
        table: {
          headers: [
            {text: '紀錄日期', value: 'created_at'},
            {text: '紀錄者', value: 'name'},
            {text: '蝦子長度', value: 'length'},
            {text: '蝦子重量', value: 'weight'},
            {text: '水溫', value: 'temp'},
            {text: '水質', value: 'water_quality'},
            {text: '飼料種類', value: 'feed'},
            {text: '品種', value: 'breed'},
            {text: '餵食量', value: 'total_feed'},
          ],
          search: '',
          page: 1,
          pageCount: 0,
          itemsPerPage: 10,
        }
      }
    },
    mounted(){

      // 讀取 API (顯示所有資料)
        axios.get('/api').then(
            res => {
                const datas = res.data

                // 處理時間，因為後端Django傳回來的資料為【時間格式】，必須轉換成【時間字串】
                for(const data of datas){
                   data.created_at = dayjs(data.created_at).format('YYYY/MM/DD HH:mm:ss')
                }
                this.record_all = datas // 將資料載入到 vue中
            },
            error => {
                alert(error) //沒接收到 印出ERROR
            }
        )
    },

    methods:{

      handleClick(event){
        const id = event.id; // 透過點擊事件得到 id
        console.log(id);

      }
    }
}
</script>

<style>

</style>