<template>
  <div class="imageContainer">
    <component :is="displayedComponent" />
  </div>
  
  
</template>

<script>
  // @ is an alias to /src
  import Dashboard from '@/components/Dashboard.vue'
  import LecturerAttendance from '@/components/LecturerAttendance'
  import { useStore } from 'vuex'
  import { computed } from 'vue';


  export default{
    components: { Dashboard,LecturerAttendance },
    setup(){
      const store = useStore()
      const lecturerAttendanceTaken = computed(()=> store.state.lecturerAttendanceTaken) 

      const displayedComponent = computed(() => {
        return lecturerAttendanceTaken.value ? 'Dashboard' : 'LecturerAttendance';
      });

      return {displayedComponent}
    }
  }

</script>
