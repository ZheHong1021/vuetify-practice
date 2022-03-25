<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  // 加入基本的資料驗證
  props: {

    label: {
      type: String,
    },
    chartData: {
      type: Array,
    },
    options: {
      type: Object,
    },
    chartColorOptions: {
      type: Object,
    },
    is_reverse:{
      type: Boolean,
      default: false,
    }
  },
  mounted() {
    this.renderLineChart();
  },

  // 透過 watch，如果需要做圖表資料的變化時 
  watch: {
    chartData: function() {
      this.renderLineChart();
    }
  },

  methods:{
    renderLineChart(){
      // 從傳入的資料中取出數字與日期，並將其反轉(因為我們拿到的是最新到最舊的資料)
      const {is_reverse} = this;

      const dates = this.chartData.map((d) => d.date)
      const totals = this.chartData.map((d) => d.total)
      if(is_reverse){
        dates.reverse();
        totals.reverse();
      }
      

      this.renderChart(
        {
          labels: dates,
          datasets: [
            {
              label: this.label,
              data: totals,
              ...this.chartColorOptions
            },
          ],
        },
        this.options
      )
    }
  }
}
</script>