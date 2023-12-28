<template>
  <div class="container">
    <div class="form-wrapper">
      <form @submit.prevent="takeAttendance" class="form">
        <div class="input-group">
          <label for="examVenue" class="label">Enter Exam Venue</label>
          <div class="input-field">
            <input
              id="examVenue"
              v-model="examVenue"
              @input="validateExamVenue"
              type="text"
              class="form-control"
              placeholder="Exam Venue"
            />
          </div>
        </div>
        <div class="input-group">
          <label for="subjectCode" class="label">Enter Subject Code</label>
          <div class="input-field">
            <input
              id="subjectCode"
              v-model="subjectCode"
              @input="validateSubjectCode"
              type="text"
              class="form-control"
              placeholder="Enter Subject Code"
            />
          </div>
        </div>

        <div class="form-group">
          <button class="btn btn-submit" type="submit">Submit</button>
        </div>
      </form>

      
    </div>

      <div class="col-lg-12" style="padding-top: 100px;">
        <div v-if="message" class="success-message">
            <div class="message-text">{{ message }}</div>
            <button @click="clearSuccessMessage" class="close-button">X</button>
        </div>
        <div v-if="error" class="error-message">
            <div class="message-text">{{ error }}</div>
            <button @click="clearErrorMessage" class="close-button">X</button>
        </div>
      </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  

  export default {
    data() {
      return {
        examVenue:'',
        form: {
          examVenue: '',
          subjectCode: '',
        },
        message: '',
        error: '',
      };
    },
    methods: {
        async takeAttendance() {
          try {
            const formData = {
              examVenue: this.examVenue.toUpperCase(),
              subjectCode: this.subjectCode.toUpperCase(),
            };

            this.$store.commit('setExamVenue', formData.examVenue.toUpperCase())

            const response = await axios.post(
              'http://54.88.151.16:8000/api/application/take-attendance/',
              formData,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': this.getCookie('csrftoken'),
                },
                withCredentials: true,
              }
            );

            console.log('Attendance taken successfully:', response.data);
            this.message = 'Attendance Taking Process End and Attendance Taken Successfully';
            this.error = '';
            this.form.examVenue = '';
            this.form.subjectCode = '';
          } catch (error) {
            this.error = 'Please make the valid input';
            this.message = '';
            console.error('There was an error!', error);
          }
        },

        getCookie(name) {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        },
        clearSuccessMessage() {
        this.message = '';
        },
      clearErrorMessage() {
        this.error = '';
        },
        validateExamVenue() {
      // Validating input fields
      const examVenueRegex = /^(\w+\s\w+\s?\d{1})$/;

      if (!examVenueRegex.test(this.examVenue)) {
      this.error = 'Exam Venue format is invalid. It should be 1 or 2 words followed by 1 number.';
      return;
    } else {
        this.error = ''; // Clear error message if input matches the format
    }
    },
    validateSubjectCode() {
      // Validating input fields
      const subjectCodeRegex = /^(\w{4}\d{4})$/;

      if (!subjectCodeRegex.test(this.subjectCode)) {
        this.error = 'Subject Code format is invalid. It should be 4 letters followed by 4 numbers.';
        return;
      } else {
        this.error = ''; // Clear error message if input matches the format
      }
    },
    },
    watch: {
      examVenue(newValue) {
        console.log('Exam Venue updated to:', newValue);
      },
    },
  };
  </script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-wrapper {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 80vh; /* Set a maximum height */
  overflow-y: auto;
}

.form {
  display: flex;
  flex-direction: column;
  width: 300px; /* Adjust the width of the form as needed */
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Aligns the entire input group to the center */
}

.input-field {
  width: 100%; /* Adjusts the width of the input field */
  display: flex;
  justify-content: center;
}

.label {
  margin-bottom: 5px;
  align-self: flex-start; /* Moves the label to the left within the input group */
  margin-left: 5px; /* Provides some spacing between label and input field */
  
}

.form-control {
  width: 90%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.button-container {
  display: flex;
  justify-content: center;
}

.message-container {
  margin-top: 20px;
}

.btn-submit {
  padding: 10px 20px; /* Adjust padding to increase button size */
  background-color: white; /* Change button color to white */
  color: #007bff; /* Change text color to a suitable color */
  border: 2px solid #007bff; /* Add a border with the same color as the text */
  border-radius: 5px;
  transition: all 0.3s ease; /* Add transition for smooth hover effect */

  /* Additional styles for when hovering over the button */
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #007bff; /* Change background color on hover */
  color: white; /* Change text color on hover */
}

.success-message {
  position: fixed;
  top: 20px; /* Adjust the vertical position above the form */
  left: 56%;
  transform: translateX(-50%); /* Center the message horizontally */
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  min-width: 200px; /* Adjust the minimum width of the message box */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  position: fixed;
  top: 20px; /* Adjust the vertical position above the form */
  left: 56%;
  transform: translateX(-50%); /* Center the message horizontally */
  background-color: #dc3545;
  color: white;
  padding: 10px;
  border-radius: 5px;
  min-width: 200px; /* Adjust the minimum width of the message box */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-text {
  margin-right: 10px; /* Adjust margin between text and close button */
}

.close-button {
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -15px;
}

/* Additional styles for hover effect */
.close-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>


  
  