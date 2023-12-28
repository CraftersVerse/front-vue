<template>
    <div class="popup-form">
      <form @submit.prevent="addVenue">
        <label for="venueID">ID:</label>
        <input v-model="venueID" id="venueID" type="text" required />

        <label for="venueNum">Number:</label>
        <input v-model="venueNum" id="venueNum" type="number" required />

        <label for="capacity">Capacity:</label>
        <input v-model="capacity" id="capacity" type="number" required />

        <button class="circular-button  fa-solid fa-plus"></button>
      </form>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import axios from 'axios';

    export default {
        setup() {
            const venueID = ref('');
            const venueNum = ref('');
            const capacity = ref(0);

            const addVenue = () => {
            // Make a POST request to the Django API endpoint
            axios
                .post('http://54.88.151.16:8000/api/application/exam-venues/', {
                venueID: venueID.value,
                venueNum: venueNum.value,
                capacity: capacity.value,
                },{
                    headers:{
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => {
                // Handle the successful response
                console.log('Exam venue saved successfully:', response.data);

                // Reset form after submitting
                venueID.value = '';
                venueNum.value = '';
                capacity.value = 0;
                })
                .catch(error => {
                // Handle errors
                console.error('Error saving exam venue:', error);
                });
            };

            return { venueID, venueNum, capacity, addVenue };
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