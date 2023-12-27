<template>
    <div>
      <h1>Exam Subject</h1>
      <div v-if="confirmationMessage">{{ confirmationMessage }}</div>
      <div v-if="noDataMessage">{{ noDataMessage }}</div>
      <table v-if="examSubject.length > 0">
        <thead>
          <tr>
            <th>Subject ID</th>
            <th>Subject Name</th>
            <th>Number of Students</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subject in examSubject" :key="subject.id">
            <td>
                <template v-if="editMode === subject.id">
                    <input v-model="editSubjectData.subjectID" type="text">
                </template>
                <template v-else>
                    {{ subject.subjectID }}
                </template>
            </td>
            <td>
                <template v-if="editMode === subject.id">
                    <input v-model="editSubjectData.subjectName" type="text">
                </template>
                <template v-else>
                    {{ subject.subjectName }}
                </template>
            </td>
            <td>
                <template v-if="editMode === subject.id">
                    <input v-model="editSubjectData.numOfStudents" type="number">
                </template>
                <template v-else>
                    {{ subject.numOfStudents }}
                </template>
            </td>
            <td>
                <template v-if="editMode === subject.id">
                    <button @click="saveEdit(subject)">Save</button>
                    <button @click="cancelEdit">Cancel</button>
                </template>
                <template v-else>
                    <button @click="editSubject(subject)">Edit</button>
                    <button @click="deleteSubject(subject.id)">Delete</button>
                </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  

<script>
    import { ref, onMounted } from 'vue';
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl="https://lggilvbvpcjmisfuzlfo.supabase.co"
    const supabaseKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZ2lsdmJ2cGNqbWlzZnV6bGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNTUyNjYsImV4cCI6MjAxMzgzMTI2Nn0.4L0CLvvH208iOfcn_8nYWuWWhZ3ZNfi2q3ru_V8pjko"
    const supabase = createClient(supabaseUrl, supabaseKey);

    export default {
        setup() {
            const examSubject = ref([]);
            const confirmationMessage = ref(null);
            const noDataMessage = ref(null);
            const editMode = ref('');
            const editSubjectData = ref(null);
            

            const fetchExamSubject = async () => {
                try {
                    const { data, error } = await supabase
                    .from('application_subject')
                    .select('*');

                    if (error) {
                        console.error('Error fetching data from Supabase:', error.message);
                    } else {
                        if (data.length === 0) {
                            console.log('No data to show');
                            noDataMessage.value = 'No data to show';
                            // console.log(noDataMessage.value)
                            
                        } else {
                            examSubject.value = data;
                            noDataMessage.value = null;
                            
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data from Supabase:', error.message);
                }
            };

            const editSubject = (subject) => {
                // Enter edit mode for the selected subject
                editMode.value = subject.id;
                // Create a copy of the original data for editing
                editSubjectData.value = { ...subject };
                console.log(editSubjectData)
            };

            const saveEdit = async (subject) => {
                try {
                    // Update the local state immediately for a responsive UI
                    examSubject.value = examSubject.value.map((v) => (v.id === subject.id ? { ...v, ...editSubjectData.value } : v));

                    // Update the Supabase database with the edited data
                    const { data, error } = await supabase
                    .from('application_subject')
                    .update(editSubjectData.value)
                    .eq('id', subject.id);

                    if (error) {
                    console.error('Error updating subject in Supabase:', error.message);
                    } else {
                    console.log('Subject updated successfully:', data);
                    // Set the confirmation message
                    confirmationMessage.value = 'Subject successfully edited!';
                    // Clear the confirmation message after a certain time (e.g., 3 seconds)
                    setTimeout(() => {
                        confirmationMessage.value = null;
                    }, 3000);
                    // Exit edit mode
                    editMode.value = null;
                    editSubjectData.value = null;
                    }
                } catch (error) {
                    console.error('Error editing subject:', error);
                }
            };

            const cancelEdit = () => {
                // Exit edit mode without saving changes
                editMode.value = null;
                editSubjectData.value = null;
            };

            const deleteSubject = async (subjectId) => {
                try {
                    // Update the local state
                    examSubject.value = examSubject.value.filter((subject) => subject.id !== subjectId);

                    // Update the Supabase database
                    const { data, error } = await supabase
                    .from('application_subject')
                    .delete()
                    .eq('id', subjectId);

                    if (error) {
                    console.error('Error deleting subject from Supabase:', error.message);
                    } else {
                    console.log('Subject deleted successfully:', data);
                    }
                } catch (error) {
                    console.error('Error deleting subject:', error);
                }
            };

            // Function to handle inserts
            const handleInserts = (payload) => {
                console.log('Insert operation:', payload);
                // Perform actions to update your Vue state based on the insert
                // For example, fetch the updated data from the server
                fetchExamSubject();
            };

            // Listen to changes in DB
            supabase
                .channel('application_subject')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'application_subject' }, handleInserts)
                .subscribe()

            onMounted(() => {
                fetchExamSubject(); // Call the method when the component is mounted
            });

            return { examSubject, fetchExamSubject, editSubject, deleteSubject, noDataMessage, saveEdit, cancelEdit, editMode, editSubjectData };
        },
    };

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
        height: 9vh;
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
        margin-right: 10px;
    }
</style>