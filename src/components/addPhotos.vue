<template>
  <div class="container">
    <div class="form-wrapper">
      <form @submit.prevent="addStudentID" class="form">
        <div class="input-group">
          <label for="studentId" class="label">Student ID</label>
          <div class="input-field">
          <input
            id="studentId"
            v-model="studentId"
            @input="validateFormat"
            type="text"
            class="form-control"
            placeholder="Enter Student ID"
          />
        </div>
      </div>
  
        <div class="button-container">
          <button class="btn btn-info btn-submit" type="submit">Submit</button>
        </div>
      </form>
  
     <!-- Success message with close button -->
     <div class="success-message" v-if="successMessage !== ''">
        <span>{{ successMessage }}</span>
        <button @click="clearSuccessMessage" class="close-button">X</button>
      </div>

      <!-- Error message with close button -->
      <div class="error-message" v-if="errorMessage !== ''">
        <span>{{ errorMessage }}</span>
        <button @click="clearErrorMessage" class="close-button">X</button>
      </div>
  </div>
  </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          studentId: '',
        },
        successMessage: '', // Success message to display
        errorMessage: '', // Error message to display
        message: '',
        error: '',
      };
    },
    methods: {
      addStudentID() {
        // Prepare form data for submission
        const formData = {
          studentId: this.studentId,
        };
  
        // Make an API call to send the form data to Django backend
        fetch('http://54.88.151.16:8000/api/application/add-photos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then(response => {
            if (response.ok) {
                return response.json(); 
              } else {
                throw new Error('Network response was not ok.');
          }
        })
          .then(data => {
            // Handle success response
            console.log('Response data:', data);
            this.successMessage = data.message; // Set success message received from the server
            this.errorMessage = ''; // Clear error message
          })
          .catch(error => {
            // Handle error response
            this.errorMessage = 'Please make the valid input';
            this.successMessage = ''; // Clear success message
            console.error('There was an error!', error);
          });
      },
      clearSuccessMessage() {
        this.successMessage = '';
    },
      clearErrorMessage() {
        this.errorMessage = '';
    },
    validateFormat() {
      const regex = /^\d{4}[a-zA-Z]{3}\d{3}$/;
      if (!this.studentId.match(regex)) {
        // If the input doesn't match the format, you can handle it here
        // For instance, you can clear the input or show an error message
        this.studentId = ''; // Clear the input field
        this.errorMessage = 'Invalid format. Please enter the ID in the correct format.';
        // You can also set an error message
        // this.errorMessage = 'Invalid format. Please enter the ID in the correct format.';
      }
      else {
      this.errorMessage = ''; // Clear the error message if the format is correct
    }
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

