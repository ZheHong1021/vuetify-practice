<template>
  <div>
    <v-navigation-drawer app 
        v-model="drawer"
        v-if="is_open_navbar"
        absolute
        temporary>
        <v-list-item>
          <!-- avatar -->
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar>

          <!-- intro -->
          <v-list-item-content m-content>
            <v-list-item-title>John Leider</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
            <router-link :to="item.link" 
              v-for="item in routes"
              :key="item.title"
              link>
              <!-- 透過 vue-router來判斷目前路徑，並給予CSS樣式 -->
              <v-list-item :class="$route.path === item.link ? 'deep-purple accent-4 text-white' : ''">
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
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
        <router-link to="/" class="nav-link" exact  style="color:white;">
            <v-btn icon><v-icon>home</v-icon></v-btn>
        </router-link>
        <v-toolbar-title>
          養殖系統
        </v-toolbar-title>
      </v-app-bar>
  </div>

</template>

<script>
export default {
    name: "Navbar",
    data: () => ({
      drawer: false,
      routes: [
          { title: 'Home', icon: 'home', link: '/' },
          { title: 'About', icon: 'forum', link: '/about' },
          { title: 'SweetAlert', icon: 'gpp_maybe', link: '/sweetAlert' },
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

<style>

</style>