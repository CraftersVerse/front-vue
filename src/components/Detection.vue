<template>
  <div>
    <h1>Image Upload</h1>
    <h2>Exam Venue: {{ examVenue }}</h2>
    <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" multiple />

    <div class="image-preview-container">
      <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview">
        <h2>Preview {{ index + 1 }}:</h2>
        <img :src="preview" alt="Image Preview" />
        <button class="remove-button" @click="removeImage(index)">X</button>
      </div>
    </div>

    <button @click="performObjectDetection">Perform Object Detection</button>

    <div class="image-preview-container">
      <div v-for="(image, index) in predictedImage" :key="index" class="image-preview">
        <h2>Predicted Image {{ index + 1 }}:</h2>
        <img :src="image.data_uri" alt="Predicted Image" />
      </div>
    </div>
    <div class="book-count">
      <p>Total Count: {{ totalCount }}</p>
      <p>Total Attendance: {{ totalAttendance }}</p>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { createClient } from '@supabase/supabase-js';
  import { useStore } from 'vuex'

  const supabaseUrl="https://lggilvbvpcjmisfuzlfo.supabase.co"
  const supabaseKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZ2lsdmJ2cGNqbWlzZnV6bGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNTUyNjYsImV4cCI6MjAxMzgzMTI2Nn0.4L0CLvvH208iOfcn_8nYWuWWhZ3ZNfi2q3ru_V8pjko"
  const supabase = createClient(supabaseUrl, supabaseKey);

  export default {
    setup() {
      const imagePreviews = ref([]);
      const predictedImage = ref([]);
      const totalCount = ref(null);
      const totalAttendance = ref(null);
      const fileInput = ref(null);
      const store = useStore()
      const examVenue = store.state.examVenue


      const handleFileChange = () => {
        if (fileInput.value && fileInput.value.files) {
          const files = fileInput.value.files;
          if (files.length > 0) {
            displayImagePreviews(files);
          }
        }
      };

      const displayImagePreviews = (files) => {
        imagePreviews.value = [];

        Array.from(files).forEach((file) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            imagePreviews.value.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      };

      const performObjectDetection = async () => {
        try {
          // console.log(examVenue)
          // console.log(examVenue.value)
          totalCount.value = 0
          const formData = new FormData();
          imagePreviews.value.forEach((preview, index) => {
            // Convert Base64 image to Blob
            const blob = dataURItoBlob(preview);
            // console.log(blob)
            formData.append(`images_${index}`, blob);
          });
          // console.log("formData",formData)
          const response = await axios.post('http://52.86.216.241:5000/predict_objects', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          predictedImage.value = response.data.predicted_images_data
          totalCount.value += predictedImage.value.reduce((total, result) => total + result.book_count, 0);

          const { data, error } = await supabase
            .from('attendance')
            .select('examVenue',{count: 'exact'})
            .eq('examVenue',examVenue);

          if (error) {
            console.error('Error fetching total attendance:', error.message);
            return;
          }
          // console.log('supabase:',data.length)
          totalAttendance.value = data.length || 0

          // console.log(totalAttendance.value)
          // perform comparison on the collected answer sheet with attendance recorded
          if(totalCount.value == totalAttendance.value){
            alert('The collected answer sheet match the number of attended student')
          }else if(totalCount.value < totalAttendance.value){
            alert('The collected answer sheet is less than the number of attended student')
          }else{
            alert('The collected answer sheet is more than the number of attended student')
          }

        } catch (error) {
          console.error('Error performing object detection:', error);
        }
      };

      // Function to remove preview image
      const removeImage = (index) => {
        imagePreviews.value.splice(index, 1);
      };

      // Function to convert Base64 to Blob
      const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        return blob;
      };

      return {
        imagePreviews,
        predictedImage,
        totalCount,
        handleFileChange,
        performObjectDetection,
        fileInput,
        examVenue,
        totalAttendance,
        removeImage,
      };
    },
  };
</script>

<style scoped>
  .image-preview-container {
    display: flex;
    flex-wrap: wrap;
  }

  .image-preview {
    margin: 10px;
    max-width: 200px; 
    position: relative;
  }

  .image-preview img {
    width: 100%;
    height: auto;
  }

  .remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #ff0000;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
</style>
