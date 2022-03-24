<template>
  <div>
    <!-- <font-awesome-icon icon="fa-solid fa-thumbs-up" /> -->
    <v-btn depressed color="primary"  @click="showAlert01">一般用法</v-btn>
    <v-btn depressed color="success"  @click="showAlert02">兩層用法</v-btn>
    <v-btn depressed color="warning"  @click="showAlert03">自定義用法(Position、Image)</v-btn>
    <v-btn depressed color="info"  @click="showAlert04">自定義用法(background))</v-btn>
  </div>
</template>

<script>
  export default {
    components: {
    },
    methods:{
      showAlert01() {
        // Use sweetalert2
        // this.$swal('Hello Vue world!!!');

        // 透過 Object
        this.$swal.fire({
          title: 'Good job!', // title
          text: 'You clicked the button!', // text
          icon: 'info', // icon( success 、 info 、 warning 、 question 、 error)
          footer: '<a href="#">Why do I have this issue?</a>',

          showCloseButton: true, // 右上角打 X按鈕
          showCancelButton: true, // cancel按鈕
          focusConfirm: false, // 是否要Focus在確認按鈕上(True、False)

          confirmButtonText: '確認好了齁!', // 確認按鈕文字(預設為 OK)
          cancelButtonText: '我要取消啦!', // 取消按鈕文字(預設為 Cancel)
        })
      },
      showAlert02() {
        // 透過 Object
        this.$swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true, // Deny按鈕
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`, // Deny按鈕名稱
          })
          .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            // 如果按了 Confirm按鈕
            if (result.isConfirmed) {
              this.$swal.fire('Saved!', '', 'success')
            
            // 如果按了 Deny按鈕
            } else if (result.isDenied) {
              this.$swal.fire('Changes are not saved', '', 'info')
            }
        })
      },
      showAlert03() {
        // 透過 Object
        this.$swal.fire({
            title: 'Your work has been saved',
            icon: 'success',
            showCloseButton: true,

            position: 'top-end', // top-end 、 bottom-end 、 
              imageUrl: 'https://unsplash.it/400/200',
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: 'Custom image',

          })
      },

      showAlert04() {
        // 透過 Object
        this.$swal.fire({
            title: '背景圖片囉',
            icon: 'success',
            showCloseButton: true,
            width: 600,
            padding: '3em',
            color: '#716add',
            background: `url(${require("@/assets/images/trees.png")})`,
            backdrop: `
              rgba(0,0,123,0.4)
              url(${require("@/assets/images/nyan-cat.gif")})
              left top
              no-repeat
            `
          })
      },




    },


  }
</script>
