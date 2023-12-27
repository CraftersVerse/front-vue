<script>
import SidebarLink from './SideBarLink'
import { collapsed, toggleSidebar, sidebarWidth } from './state'

export default {
  props: {},
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth }
  }
}
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <h1>
      <span v-if="collapsed">
        <div>E</div>
        <div>M</div>
        <div>S</div>
      </span>
      <span v-else>Exam Management System</span>
    </h1>

    <SidebarLink to="/" icon="fas fa-home">Dashboard</SidebarLink>
    <SidebarLink to="/detection" icon="fas fa-camera">Detection</SidebarLink>
    <SidebarLink to="/exam_venue_list" icon="fas fa-table-list">Exam Venue List</SidebarLink>
    <SidebarLink to="/exam_arrange" icon="fas fa-users">Exam Arrangement</SidebarLink>
    <SidebarLink to="/exam_subject_list" icon="fas fa-table-list">Subject List</SidebarLink>
    <SidebarLink to="/add_photo" icon="fas fa-image">Add Photo</SidebarLink>
    <SidebarLink to="/take_attendance" icon="fas fa-image">Take Attendance</SidebarLink>
    <SidebarLink to="/display_attendance" icon="fa-solid fa-eye">Display Attendance</SidebarLink>
    <SidebarLink to="/display_absent" icon="fa-solid fa-eye">Display Absent</SidebarLink>
    <SidebarLink to="/push_email" icon="fa-solid fa-envelope">Push Email</SidebarLink>
    <SidebarLink to="/display_student" icon="fa-solid fa-file-powerpoint">Enrollment Student Data</SidebarLink>
    <!-- <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="fas fa-angle-double-left" />
    </span> -->
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #2f855a;
  --sidebar-item-hover: #38a169;
  --sidebar-item-active: #276749;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);

  max-height: 100vh;
  overflow-y: auto;
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

.sidebar h1 {
  height: 3.5em;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;

  color: rgba(255, 255, 255, 0.7);

  transition: 0.2s linear;

  margin-top: auto;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>