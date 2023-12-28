<template>
    <div class="get_date">
        <form @submit.prevent="sendDate">
            <label for="start_date">Start Date:</label>
            <input v-model="start_date" id="start_date" type="date" required />

            <label for="end_date">End Date:</label>
            <input v-model="end_date" id="end_date" type="date" required />

            <button>Arrange</button>
        </form>
    </div>
    <div class="display_arrangement">
        <div v-if="message">
            <p>{{ message }}</p>
        </div>
        <div v-if="arrangements.length == 0">
            <p>No arrangements yet.</p>
        </div>
        <table v-else-if="arrangements.length > 0">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Subject Info</th>
                    <th>Venue</th>
                    <th>Number of Students</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="arrangement in arrangements" :key="arrangement.Date">
                    <td>{{ arrangement.Date }}</td>
                    <td>{{ arrangement['Subject Name'] }}</td>
                    <td>{{ arrangement.Venue }}</td>
                    <td>{{ arrangement['Number of Students'] }}</td>
                </tr>
            </tbody>
    </table>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import axios from 'axios';

    export default{
        setup(){
            const start_date = ref('')
            const end_date = ref('')
            const arrangements = ref([]);
            const message = ref('');

            const sendDate = () =>{
                const currentDate = new Date()
                const selectedStartDate = new Date(start_date.value)
                const selectedEndDate = new Date(end_date.value)

                if (selectedStartDate < currentDate || selectedEndDate < currentDate) {
                    alert("Please input a future date");
                    return;
                }
                axios
                    .post('http://54.88.151.16:8000/api/application/exam-arrange/',{
                        start_date : start_date.value,
                        end_date : end_date.value
                    },{
                        headers:{
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => {
                        // Handle the successful response
                        console.log('Date sent to backend', response.data);
                        arrangements.value = response.data.arrangements;
                        console.log(response.data.message)
                        message.value = response.data.message || ''
                    })
                    .catch(error => {
                        // Handle errors
                        console.error('Error sending Date', error);
                    });
            }
            return { start_date, end_date, sendDate, arrangements, message };
        }
    }
</script>

<style scoped>

    * {
    margin: 0;
    padding: 0;

    box-sizing: border-box;
    font-family: sans-serif;
    }

    div{
        padding-left: 3%;
    }

    table {
        width: 78vw;
        height: auto;
        background-color: #fff5;

        backdrop-filter: blur(7px);
        box-shadow: 0 .4rem .8rem #0005;
        border-radius: .8rem;

        overflow: hidden;
    }

    thead th {
        position: sticky;
        top: 0;
        left: 0;
        background-color: #d5d1defe;
        cursor: pointer;
        text-transform: capitalize;
        /* width: calc(100% / 6); */
        width: auto;
        /* Distribute the width evenly among the six columns */
        text-align: center;
        /* Center align the text */
        padding: 0.5rem;
        /* Add some padding for better spacing */
    }

    th,td{
        border-collapse: collapse;
        padding: 1rem;
        text-align: center;
    }

    tbody tr:nth-child(even) {
        background-color: #0000000b;
    }

    tbody tr:hover {
        background-color: #0000001a;
    }

    button{
        margin-left: 10px;
    }

    label {
        margin-left: 10px; /* Add this line to create space below each input */
    }

    .get_date {
        padding-top: 2%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
</style>