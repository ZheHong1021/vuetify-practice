<template>
  <div class="main-container">
    <h1 class="mb-6 text-sm-h4 text-h5">蝦苗重量評估</h1>
    <v-row>
        <v-col cols="6">
            <label for="date_select" class="form-label">日期選擇</label><br>
            <input class="form-control" id="date_select" type="date" v-model="choose_date" @change="changeDate">
        </v-col>

        <v-col cols="6">
          <label for="date_select" class="form-label">場域選擇</label><br>
          <v-select v-model="select_area" :items="items" label="請選擇場域" solo></v-select>
        </v-col>
    </v-row>

    <v-container>
        <v-row>
          <v-col cols="12" md="6">
              <v-card >
                <v-card-text>
                 <h2>蝦池資訊</h2>
                </v-card-text>
                <v-container>
                  <v-data-table
                      :headers="headers"
                      :items="shrimps"
                      :page.sync="page"
                      class="elevation-1"
                      :items-per-page="itemsPerPage"
                      @page-count="pageCount = $event"
                      :search="search"
                      hide-default-footer
                      @click:row="handleClick"
                    >
                      <template v-slot:top>
                        <v-text-field v-model="search" label="搜尋" class="mx-4"
                          append-icon="mdi-magnify"></v-text-field>
                      </template>
                    </v-data-table>

                      <div class="text-center pt-2">
                        <v-pagination
                          v-model="page"
                          :length="pageCount"
                        ></v-pagination>
                      </div>
                    </v-container>
                </v-card>
          </v-col>

          <v-col cols="12" md="6" >
            <v-container>
              <v-card >
                <v-card-text><h2>生長比較圖</h2></v-card-text>
                <LineChart  
                    :chartData="renderData.chartData"
                    :options="chartOptions"
                    :label="renderData.label"
                    :chartColorOptions="renderData.chartColorOptions"
                    :markLine="markLineData"
                  />

                  <v-card-text>
                    <h3><v-icon class="primary--text" large>zoom_in</v-icon>蝦子生長分析</h3>
                      <h4>
                        生長情況:
                        <v-chip color="green darken-2" class="ml-0 mr-2 white--text" label small>優良</v-chip>
                      </h4>
                      <br>
                      <v-divider></v-divider>
                      <br>
                      <h3>
                        <v-icon class="primary--text" large>thumb_up_alt</v-icon>
                        
                        推薦作法
                      </h3>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et facere reiciendis odit est doloribus dolores officia laborum tempora ex at iste, ullam alias dolor sunt, maiores hic iure exercitationem. Ipsa quos, non commodi, velit eligendi sit tempore vel iusto quas quibusdam dolores inventore! Minima ad officiis atque veritatis obcaecati quos.</p>
                  </v-card-text>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      
    </v-container>

  </div>  
</template>

<script>
import {shrimpsAPI} from "@/api"
import LineChart from '@/components/LineChart'
import dayjs from 'dayjs'
export default {
  components: {
    LineChart,
  },
  data(){
    return({
      choose_date: null, // 選擇得到的日期
      choose_Shrimp_date: "2021/11/07", // 選擇特定蝦池的起始日期
      markLineData: {label: '', data: []},

      select_area: null,
      items: ['Foo', 'Bar', 'Fizz', 'Buzz'],

      search: '',
      shrimps: [],
      
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,

      chartData: [],
      chartOptions: {  // 新增這裡
          responsive: true,
          maintainAspectRatio: false,
          // X軸、Y軸
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: '養殖天數'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: '重量(克)'
              }
            }]
          }
      },

    })
  },

  created(){
    this.shrimps = shrimpsAPI;
    this.choose_date = dayjs(new Date()).format("YYYY-MM-DD"); // 初始化先設今天日期
    this.changeDate();
    this.chartDemo()

  },

  computed: {
      now_date(){
        const now = dayjs(new Date())
        return now.$d
      },
      headers () {
        return [
          {
            text: '起始日期',
            value: 'start_date',
          },
          {
            text: '養殖天數',
            value: 'grow_day',
          },
          {
            text: '蝦池',
            align: 'start',
            value: 'name',
          },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'col1 (g)', value: 'col1' },
          { text: 'col2 (g)', value: 'col2' },
          { text: 'col3 (%)', value: 'col3' },
        ]
      },

      renderData(){
        const {chartData} = this;
        const chartColorOption = {
          borderColor: '#EF5350',
          backgroundColor: 'rgba(255, 56, 96, 0.1)',
        }
        return {
          label: "重量(克) / 養殖天數",
          chartData,
          chartColorOptions: chartColorOption,
        };
      },
    },


  methods: {
    // 改變天數時的 change事件
    changeDate(){
      const choose_date = new Date(this.choose_date);
      for(const shrimp of this.shrimps){
        const start_date = new Date(shrimp.start_date);
        const diff_day = this.difference(start_date, choose_date)
        this.$set(shrimp, "grow_day", diff_day) // 因為 Vue2，在做資料更新時，要用這種方式才能渲染
      }
    },

    // 取得養殖天數
    difference(date1, date2) {  
      const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      const  day = 1000*60*60*24;
      return(date2utc - date1utc) / day
    },

    // 測試計算重量公式( 生長日 / 20 + 3 * 0.5 )
    test_Weight_Func(grow_day){
      return grow_day / 20 + 3 * 0.5;
    },


    chartDemo(){
      // const choose_date = new Date(this.choose_date);
      const choose_Shrimp_date = new Date(this.choose_Shrimp_date);
      // let diff_day = this.difference(choose_Shrimp_date, choose_date)
      let diff_day = this.difference(choose_Shrimp_date, this.now_date)
      diff_day += 30; // 讓圖變好看一點，因為如果沒加，我們選擇的日期會在最後面被擋住

      this.chartData = [];

      // 該資料依照生長日套用公式讀取出來
      for(let i = 1 ; i <= diff_day ; i++){
        this.chartData.push({date: `${i}天`, total: this.test_Weight_Func(i)})
      }
    },

    handleClick(event){
      // console.log(event); // 得到點擊的那列資料
        this.markLineData.data.length = 0;
       let markline = event["grow_day"];
        this.markLineData.label = event['name'];
        for(let i = 0; i < markline ; i++){
          if(i == (markline - 1)){
            this.markLineData.data.push(event["fat"]);
            break;
          }
          this.markLineData.data.push("");
        }

    }
  },

}
</script>


<style lang="scss" scoped>
  .form-control{
    border: 2px solid #000;
    border-radius: 4px;
    cursor: pointer;

    &:focus, &:hover{
      background: #ffeaa7;
    }
  }
</style>
