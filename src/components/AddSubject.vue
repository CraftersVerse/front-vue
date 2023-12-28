<template>
    <div class="popup-form">
      <form @submit.prevent="addSubject">
        <label for="subjectID">ID:</label>
        <input v-model="subjectID" id="subjectID" type="text" required />

        <label for="subjectName">Subject Name:</label>
        <input v-model="subjectName" id="subjectName" type="text" required />

        <label for="numOfStudents">Number Of Students:</label>
        <input v-model="numOfStudents" id="numOfStudents" type="number" required />

        <button class="circular-button fa-solid fa-plus"></button>
      </form>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import axios from 'axios';

    export default {
        setup() {
            const subjectID = ref('');
            const subjectName = ref('');
            const numOfStudents = ref(0);

            const addSubject = () => {
            // Make a POST request to the Django API endpoint
            axios
                .post('http://54.88.151.16:8000/api/application/exam-subject/', {
                subjectID: subjectID.value,
                subjectName: subjectName.value,
                numOfStudents: numOfStudents.value,
                },{
                    headers:{
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => {
                // Handle the successful response
                    console.log('Exam subject saved successfully:', response.data);

                    // Reset form after submitting
                    subjectID.value = '';
                    subjectName.value = '';
                    numOfStudents.value = 0;
                })
                .catch(error => {
                // Handle errors
                    console.error('Error saving exam subject:', error);
                });
            };

            return { subjectID, subjectName, numOfStudents, addSubject };
        },
    };
</script>

<style scoped>
    .popup-form {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .circular-button {
        
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #000000;
        color: #ffffff;
        border: none;
        cursor: pointer;
        font-size: 24px;
    }

    button {
        background-color: blue;
        color: white;
        padding: 10px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-left: 10px;
    }

    button:hover {
        background-color: darkblue;
    }

    label {
        margin-left: 10px; /* Add this line to create space below each input */
    }
</style>