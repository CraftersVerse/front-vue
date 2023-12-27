<template>
    <div class="imageContainer">
        <!-- <img :src='videoSrc' alt="Webcam Feed" width="640" height="480"> -->
        <button @click="takeAttendance">Login</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {ref} from 'vue'
  import { useStore } from 'vuex';

  export default {
    setup() {
        const store = useStore();
        const videoSrc = ref(null)
        const takeAttendance = async () => {
            try {
            const response = await axios.post('http://127.0.0.1:8000/api/application/take-lecturer-attendance/', {
            // const response = await axios.get('http://127.0.0.1:5000/video_feed', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                store.commit('setlecturerAttendance', true)
                const result = await response.json();
                console.log(result.success);
                // handle success, e.g., show a success message
            } else {
                const error = await response.json();
                console.error(error.error);
                // handle error, e.g., show an error message
            }
            } catch (error) {
            console.error('Error:', error);
            // handle network or other errors
            }
        };
    
        return { takeAttendance,videoSrc };
        },
    };
  </script>
  
  <style scoped>
  .imageContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 95vh;
  }
  
  .imageContainer button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  