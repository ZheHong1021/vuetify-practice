<template>
  <v-app>
    <!-- Navigation -->
    <v-navigation-drawer app 
      v-model="drawer"
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
            v-for="item in items"
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';
export default {
  components: { Navbar },
  name: 'App',
  component: {
    Navbar: Navbar
  },
  data: () => ({
    drawer: true,
    items: [
        { title: 'Home', icon: 'mdi-view-dashboard', link: '/' },
        { title: 'About', icon: 'mdi-forum', link: '/about' },
    ],
  }),

  created(){
    console.log();
  },
};
</script>


<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a{
  list-style: none;
   text-decoration:none;
}
</style>