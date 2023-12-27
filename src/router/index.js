import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/detection',
    name: 'Detection',
    component: () => import('../views/Detect.vue')
  },
  {
    path: '/exam_venue_list',
    name: 'Exam Venue List',
    component: () => import('../views/ExamVenue.vue')
  },
  {
    path: '/exam_subject_list',
    name: 'Exam Subject List',
    component: () => import('../views/Subject.vue')
  },
  {
    path: '/exam_arrange',
    name: 'Exam Arrange',
    component: () => import('../views/Arrange.vue')
  },
  {
    path: '/add_photo',
    name: 'Add Photo',
    component: () => import('../views/AddPhoto.vue')
  },
  {
    path: '/take_attendance',
    name: 'Take Attendance',
    component: () => import('../views/TakeAttendance.vue')
  },
  {
    path: '/display_attendance',
    name: 'Display Attendance',
    component: () => import('../views/DisplayAttendance.vue')
  },
  {
    path: '/display_absent',
    name: 'Display Absent',
    component: () => import('../views/DisplayAbsent.vue')
  },
  {
    path: '/push_email',
    name: 'Push Email',
    component: () => import('../views/PushEmail.vue')
  },
  {
    path: '/display_student',
    name: 'Display Student',
    component: () => import('../views/DisplayStudent.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router