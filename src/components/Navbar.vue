<template>
  <div>
    <v-navigation-drawer app 
        v-model="drawer"
        v-if="is_open_navbar"
        temporary>
        <v-list-item>
          <!-- avatar -->
          <v-list-item-avatar>
            <v-img src="https://s.yimg.com/uu/api/res/1.2/beAavHDSzDbuL9hOFBDodg--~B/aD02NzU7dz0xMjAwO2FwcGlkPXl0YWNoeW9u/https://media.zenfs.com/zh-tw/ebc.net.tw/5e04714f157d2756325a0cb2eb67bf23"></v-img>
          </v-list-item-avatar>

          <!-- intro -->
          <v-list-item-content m-content>
            <v-list-item-title>吉娃娃</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
            <router-link :to="item.link" 
              v-for="item in routes"
              :key="item.title"
              link>
              <!-- 透過 vue-router來判斷目前路徑，並給予CSS樣式 -->
              <v-list-item :class="$route.path === item.link ? 'primary lighten-1 white--text' : ''">
                  <v-list-item-icon>
                    <v-icon :color="$route.path === item.link ? 'white' : '' ">{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
            </router-link>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <!-- sidebar-icon -->
        <v-app-bar-nav-icon v-if="is_open_navbar" @click.stop="drawer = !drawer" />
        <router-link to="/" class="nav-link white--text" exact>
            <v-btn icon><v-icon>home</v-icon></v-btn>
        </router-link>
        <v-toolbar-title>養殖系統</v-toolbar-title>

        <!-- 空格 -->
         <v-spacer></v-spacer>

            <nav class="d-flex" v-if="!is_open_navbar">
              <router-link 
                :to="route.link" 
                v-for="route in routes" 
                :key="route.link"
                active-class="active" exact
                class="route-link">
                <v-toolbar-title class="mx-6 row-pointer">{{route.title}}</v-toolbar-title>
              </router-link>
            </nav>
      </v-app-bar>
  </div>

</template>

<script>
export default {
    name: "Navbar",
    data: () => ({
      drawer: false,
      routes: [
          { title: '首頁', icon: 'home', link: '/' },
          { title: '蝦苗病毒檢測', icon: 'home', link: '/test' },
          // { title: '蝦苗重量評估', icon: 'forum', link: '/about' },
          // { title: '蝦苗餵食量記錄', icon: 'dining', link: '/feed' },
          // { title: '預估標準', icon: 'preview', link: '/sweetAlert' },
          // { title: 'COVID-19 Chart', icon: 'gpp_maybe', link: '/chart' },
      ],
    }),

    computed:{

      // 只有在裝置寬度小於 960時，才會開啟
        is_open_navbar() {
          const rwd = this.$vuetify.breakpoint.name;
            if(rwd === 'xs' || rwd === 'sm'){
              return true;
            }
            return false;

        },
    }
   
  }
</script>

<style lang="scss" scoped>


      // 沒有 active
    .route-link{
        color: #9E9E9E;
        transition: .3s;

        &:hover{
            color: #f4623a;
            font-weight: bolder;
            transform: translateY(-5px);
        }
    }


    // 有 active
    .active{
        color: #f4623a;
        font-weight: bolder;
    }





  @keyframes animate{
        0%{
            width: 0%;
            height: 2px;
        }
        100%{
            width: 100%;
            height: 4px;
        }
    }


</style>>
