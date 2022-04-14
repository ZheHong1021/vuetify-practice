<template> 
    <div class="container">
            <h1>找不到該頁面</h1>
        <img src="../assets/images/NotFoundIcon.png" alt="">
        <div>
            <p>請進入正確的連結</p>

                <div class="link">
                    <v-icon large>mdi-arrow-right-bold-circle</v-icon>
                    <router-link class="link" to="/">
                        回到首頁
                    </router-link>
                    <v-icon large>mdi-arrow-left-bold-circle</v-icon>
                </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "NotFoundPage",
    setup(){

    }
}
</script>

<style scoped>
    div.container{
        height:800px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    img{
        width: 14rem;
        margin: 2rem 0;
    }
    .container div{
        text-align: center;
    }
    h1{
        font-weight: bolder;
    }
    p{
        margin-top: 1rem;
        font-size: 1.5rem;
    }

    .link{
        font-size: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .5rem;
        font-weight: bolder;
    }

    i.v-icon.v-icon {
        color: blue;
    } 
</style>