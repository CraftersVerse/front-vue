<template>
  <div :class="{ 'unclickable': !lecturerAttendanceTaken }">
    <Sidebar/>
  </div> 
  <div :style="{ 'margin-left': sidebarWidth }">
    <router-view />
  </div>
</template>

<script>
  import Sidebar from '@/components/sidebar/SideBar'
  import { sidebarWidth } from '@/components/sidebar/state'
  import { useStore } from 'vuex';
  import { computed } from 'vue';
  import store from './store'

  export default {
    store,
    components: { Sidebar },
    setup() {

      const store = useStore();
      const lecturerAttendanceTaken = computed(() => store.state.lecturerAttendanceTaken);
      return { sidebarWidth, lecturerAttendanceTaken }
    }
}
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .unclickable {
    pointer-events: none;
  }
</style>
