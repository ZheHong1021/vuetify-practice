const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: 'dist',
  assetsDir: 'static', // 指定build時，在靜態文件上一層添加static目錄
  devServer: {
    // disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000/',
        // target: 'https://shrimp-backend-system.herokuapp.com/api/',
        // pathRewrite: {
        //   '^/api': 'api/'
        // },
        // ws: true, // 用於支援 websocket
        // changeOrigin: true // 用於控制請求投中的 Host 值
      }
    }
  }
})
