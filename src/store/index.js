import { createStore } from 'vuex'

const storedValue = sessionStorage.getItem('lecturerAttendanceTaken');
const initialAttendance = storedValue !== null ? JSON.parse(storedValue) : false;

export default createStore({
  state: {
    examVenue: null,
    lecturerAttendanceTaken: initialAttendance,
  },
  mutations: {
    setExamVenue(state, newExamVenue) {
      state.examVenue = newExamVenue
    },

    setlecturerAttendance(state, newAttendance) {
      state.lecturerAttendanceTaken = newAttendance
      sessionStorage.setItem('lecturerAttendanceTaken', JSON.stringify(newAttendance))
    },
  },
  actions: {
  },
  modules: {
  }
})
