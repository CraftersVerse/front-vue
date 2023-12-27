<template>
    <div class="home">
        <div class="enrollmentContainer">
            <canvas :id="enrollmentChart"></canvas>
        </div>
        <div class="attendanceContainer">
            <canvas :id="attendanceChart"></canvas>
        </div>
        
    </div>
</template>

<script>
    import Chart from 'chart.js/auto';
    import { onMounted, ref } from 'vue';
    import { createClient } from '@supabase/supabase-js';
    import { useStore } from 'vuex'

    const supabaseUrl="https://lggilvbvpcjmisfuzlfo.supabase.co"
    const supabaseKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZ2lsdmJ2cGNqbWlzZnV6bGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNTUyNjYsImV4cCI6MjAxMzgzMTI2Nn0.4L0CLvvH208iOfcn_8nYWuWWhZ3ZNfi2q3ru_V8pjko"
    const supabase = createClient(supabaseUrl, supabaseKey);

    export default {
        setup(){
        const enrollmentChart = ref('enrollmentChart');
        const attendanceChart = ref('attendanceChart');
        const store = useStore()
        const examVenue = store.state.examVenue
        const enrollmentData = ref([])
        const totalEnrollment = ref([])
        const present = ref()
        const absent = ref()

        onMounted(async() => {
            if(!examVenue){
                await getEnrollmentData()
                console.log(examVenue)
                createBarChart(enrollmentChart.value,enrollmentData.value, totalEnrollment.value);
                
            }else{
                await getAttendanceData()
                console.log(examVenue)
                createDoughnutChart(attendanceChart.value,absent,present);
            }
            
        });

        const getEnrollmentData = async ()=> {
            try {
                const { data, error } = await supabase.from('enrollment').select('subjectCode');

                if (error) {
                    console.error('Error fetching data:', error);
                } else {
                    
                    const unique = new Set(data.map(item => JSON.stringify(item)))
                    // console.log(unique)
                    enrollmentData.value = Array.from(unique).map(item => JSON.parse(item));
                    enrollmentData.value.sort((a, b) => a.subjectCode.localeCompare(b.subjectCode));

                    const totalEnrollmentObject = {};
                    data.forEach(item => {
                        const subjectCode = item.subjectCode;
                        totalEnrollmentObject[subjectCode] = (totalEnrollmentObject[subjectCode] || 0) + 1;
                    });

                    const totalEnrollmentArray = Object.entries(totalEnrollmentObject)
                    .map(([subjectCode, count]) => ({ subjectCode, count }))
                    .sort((a, b) => a.subjectCode.localeCompare(b.subjectCode));

                    totalEnrollment.value = totalEnrollmentArray.map(item => item.count);
                    console.log(totalEnrollment.value);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const getAttendanceData = async () =>{
            try {
                const {data:attendanceRecords, error:attendanceError} = await supabase.from('attendance')
                    .select('examVenue').eq('examVenue',examVenue)

                const {data:absentRecords, error:absentError} = await supabase.from('absent')
                    .select('examVenue').eq('examVenue',examVenue)

                if(attendanceError || absentError){
                    console.log('Error fetching data:', attendanceError,absentError)
                }else{
                    present.value = attendanceRecords.length;
                    absent.value = absentRecords.length;
                    console.log(present,absent)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        function createDoughnutChart(attendanceChart, absent,present) {
            const ctx = document.getElementById(attendanceChart);
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Absent', 'Present'],
                    datasets: [{
                        label: 'No.of Students',
                        data: [absent,present],
                        borderWidth: 1,
                        backgroundColor: ['#36A2EB', '#FF6384'],
                        hoverBackgroundColor: ['#206AA9', '#C0395C']
                    }]
                },
                options: {
                    // Your doughnut chart options
                }
            });
        }

        function createBarChart(enrollmentChart, data, count) {
            const ctx = document.getElementById(enrollmentChart);
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.subjectCode),
                    datasets: [{
                        label: 'Total Enrollment',
                        data: count,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        return {
            enrollmentChart,
            attendanceChart,
            getEnrollmentData,
            getAttendanceData,
        };
        }
    };
</script>

<style scoped>
    .home{
        padding-left: 10px;
    }

    .attendanceContainer, .enrollmentContainer{
        width: 700px;
        height: 700px;
    }


</style>