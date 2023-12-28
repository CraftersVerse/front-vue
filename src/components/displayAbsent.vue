<template>
    <div>
      <div class="container">
    <div class="form-wrapper">
      <form @submit.prevent="displayAbsent" class="form">
        <div class="form-group">
          <label for="examVenue" class="label">Enter Exam Venue</label>
          <div class="input-field">
          <input
            id="examVenue"
            v-model="form.examVenue"
            @input="validateExamVenue"
            type="text"
            class="form-control"
            placeholder="Exam Venue"
          />
          </div>
        </div>
        <div class="form-group">
          <label for="subjectCode" class="label">Enter Subject Code</label>
          <div class="input-field">
          <input
            id="subjectCode"
            v-model="form.subjectCode"
            @input="validateSubjectCode"
            type="text"
            class="form-control"
            placeholder="Subject Code"
          />
          </div>
        </div>
  
        <!-- Submit Button -->
        <div class="form-group button-container">
          <button class="btn btn-submit" type="submit">Submit</button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="message" class="success-message">
        <div class="message-text">{{ message }}</div>
        <button @click="clearSuccessMessage" class="close-button">X</button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <div class="message-text">{{ error }}</div>
        <button @click="clearErrorMessage" class="close-button">X</button>
      </div>
    </div>
  </div>
  
      <main class="main table" ref="student_table">
        <section class="table__header">
          <h1>Absent Students</h1>
          <div class="input-group">
            <input type="search" v-model="searchValue" @input="searchTable" placeholder="Search">
            <img :src="require('@/assets/search.png')" alt="Search Image" >
          </div>

          <div class="export__file">
          <label for="export-file" class="export__file-btn" title="Export File">
            <div class="print-image">
              <img src="@/assets/print.jpg" alt="Print Image">
            </div>
          </label>
          <input type="checkbox" id="export-file">
          <div class="export__file-options">
            <label>Export As &nbsp; &#10140;</label>
            <label for="export-file" @click="toPDF">PDF <img src="@/assets/pdf.png" alt=""></label>
            <label for="export-file" @click="toCSV">CSV <img src="@/assets/csv.png" alt=""></label>
            <label for="export-file" @click="toExcel">Excel <img src="@/assets/excel.png" alt=""></label>
          </div>
        </div>
        </section>
        <section class="table__body">
          <table>
            <thead>
              <tr>
                <th> Id </th>
                <th @click="sortTablebyName(true)"> Name <span class="icon-arrow">&UpArrow;</span></th>
                <th> Phone Number</th>
                <th> Email</th>
                <th> Gender</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in studentDataFiltered" :key="index">
                <td>{{ student.id }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.phoneNum}}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.gender }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        form: {
          examVenue: '',
          subjectCode: '',
        },
        message: '',
        error: '',
        searchValue: '',
        studentData: [], // Initialize as an empty array
      };
    },
    computed: {
      studentDataFiltered() {
        const search = this.searchValue.toLowerCase().trim();
  
        if (!search) {
          return this.studentData;
        }
  
        return this.studentData.filter((student) =>
          student.id.toLowerCase().includes(search) ||
          student.name.toLowerCase().includes(search) ||
          student.phoneNum.toLowerCase().includes(search) ||
          student.email.toLowerCase().includes(search) ||
          student.gender.toLowerCase().includes(search)
        );
      },
    },
    methods: {
      async displayAbsent() {
        try {
          const formData = {
            examVenue: this.form.examVenue.toUpperCase(),
            subjectCode: this.form.subjectCode.toUpperCase(),
          };
  
          const response = await axios.post(
            'http://127.0.0.1:8000/api/application/display-absent/',
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken'),
              },
              withCredentials: true,
            }
          );
          console.log('Response from backend:', response);
          console.log('Response Data:', response.data);
  
          this.studentData = response.data['Absent Student'];
          this.error = '';
          this.form.examVenue = '';
          //this.form.subjectCode = '';
          this.searchTable(); // Trigger search after updating data
          this.showTable();
          this.message = 'Absent Student Generated Successfully';
  
        } catch (error) {
          this.error = 'No matched subject code and exam venue.';
          this.message = '';
          console.error('There was an error!', error);

          if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }

        }
      },
      showTable() {
        const table = document.querySelector('.main.table');
        const searchBar = document.querySelector('.table__header .input-group');
        table.style.display = 'block';
        searchBar.classList.add('hide-search');
      },
      showSearchBar() {
        const searchBar = document.querySelector('.table__header .input-group');
        searchBar.classList.remove('hide-search');
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
      searchTable() {
        const searchValue = this.searchValue.toLowerCase();
        const tableRows = document.querySelectorAll('tbody tr');
  
        tableRows.forEach((row, i) => {
          const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
          const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
          const phoneNum = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
          const email = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
          const gender = row.querySelector('td:nth-child(5)').textContent.toLowerCase();

  
          const isMatch =
            id.includes(searchValue) ||
            name.includes(searchValue) ||
            phoneNum.includes(searchValue) ||
            email.includes(searchValue) ||
            gender.includes(searchValue);
  
          row.classList.toggle('hide', !isMatch);
          row.style.setProperty('--delay', i / 25 + 's');
        });
  
        document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
          visibleRow.style.backgroundColor = i % 2 == 0 ? 'transparent' : '#0000000b';
        });
      },
      sortTablebyName(sortAsc) {
      this.studentDataFiltered.sort((a, b) => {
        let firstRow = a.name.toLowerCase(),
          secondRow = b.name.toLowerCase();

        return sortAsc ? (firstRow < secondRow ? -1 : 1) : firstRow > secondRow ? -1 : 1;
      });
    },
    toPDF() {
      console.log('Form Data:', this.form);
      const tableHTML = this.$refs.student_table.innerHTML;

      const printableContent = document.createElement('div');
      printableContent.innerHTML = tableHTML;
      const elementsToRemove = printableContent.querySelectorAll('.input-group, .export__file');
      elementsToRemove.forEach(element => element.remove());

      const images = printableContent.querySelectorAll('img');
      images.forEach(img => img.remove());

      // Retrieve the subject code from the form object
      const subjectCode = 'Subject Code: ' + this.form.subjectCode.toUpperCase(); // Updated line
      console.log('subject: ', subjectCode)

      const htmlContent = `<main class="table">${subjectCode}${printableContent.innerHTML}</main>`;

      const newWindow = window.open();
      newWindow.document.write(htmlContent);

      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
        }, 400);
      };
    },
    toCSV() {
      // Functionality to convert table data to CSV remains unchanged

      // Retrieve the subject code from the form object
      const subjectCode = 'Subject Code: ' + this.form.subjectCode.toUpperCase(); // Updated line

      const csvData = this.convertToCSV();
      this.downloadFile(csvData, 'csv', 'Absent_data.csv');
    },

    convertToCSV() {
  const table = document.querySelector('table');
  const tbodyRows = table.querySelectorAll('tbody tr');

  const headings = 'Id,Name,PhoneNumber,Email,Gender'; // Updated headings

  const tableData = [...tbodyRows]
    .map(row => {
      const cells = row.querySelectorAll('td');
      const imgElement = row.querySelector('td img');

      // Check if imgElement exists before accessing its src attribute
      const imgSrc = imgElement ? decodeURIComponent(imgElement.src) : '';

      const dataWithoutImg = [...cells]
        .map(cell => cell.textContent.replace(/,/g, ".").trim())
        .join(',');

      return dataWithoutImg + ',' + imgSrc;
    })
    .join('\n');

  // Retrieve the subject code from the form object
  const subjectCode = 'Subject Code: ' + this.form.subjectCode.toUpperCase(); // Updated line

  const csv = subjectCode + '\n' + headings + '\n' + tableData; // Add subjectCode to CSV
  return csv;
},

toExcel() {
      const subjectCode = 'Subject Code: ' + this.form.subjectCode.toUpperCase();
      const table = document.querySelector('table');
      const tbodyRows = table.querySelectorAll('tbody tr');
      const headings = 'id\tname\tphone number\temail\tgender'; // Updated headings

      const tableData = [...tbodyRows]
        .map(row => {
          const cells = row.querySelectorAll('td');
          const imgElement = row.querySelector('td img');
          const imgSrc = imgElement ? decodeURIComponent(imgElement.src) : '';
          const dataWithoutImg = [...cells]
            .map(cell => cell.textContent.trim().replace(/\t/g, '').replace(/,/g, '.'))
            .join('\t');
          return dataWithoutImg + '\t' + imgSrc;
        })
        .join('\n');

      const excel = subjectCode + '\n' + headings + '\n' + tableData;
      this.downloadFile(excel, 'excel', 'Absent_Data.xlsx');
    },

    downloadFile(data, fileType, fileName = '') {
      const a = document.createElement('a');
      a.download = fileName;
      const mimeTypes = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
      a.href = `data:${mimeTypes[fileType]};charset=utf-8,${encodeURIComponent(data)}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    },

    },
    mounted() {
      const search = document.querySelector('.input-group input');
      const tableRows = document.querySelectorAll('tbody tr');
  
      const searchTable = () => {
        const searchValue = this.searchValue.toLowerCase();
  
        tableRows.forEach((row, i) => {
          const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
          const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
          const phoneNum = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
          const email = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
          const gender = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
  
          const isMatch =
            id.includes(searchValue) ||
            name.includes(searchValue) ||
            phoneNum.includes(searchValue) ||
            email.includes(searchValue) ||
            gender.includes(searchValue);
  
          row.classList.toggle('hide', !isMatch);
          row.style.setProperty('--delay', i / 25 + 's');
        });
  
        document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
          visibleRow.style.backgroundColor = i % 2 == 0 ? 'transparent' : '#0000000b';
        });
      };
  
      search.addEventListener('input', searchTable);
    },
  };
  </script>
  
  <style>
  * {
    margin: 0;
    padding: 0;

    box-sizing: border-box;
    font-family: sans-serif;
}

body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

main.table {
    width: 82vw;
    height: 90vh;
    background-color: #fff5;

    backdrop-filter: blur(7px);
    box-shadow: 0 .4rem .8rem #0005;
    border-radius: .8rem;

    overflow: hidden;
}

.table__header {
    width: 100%;
    height: 10%;
    background-color: #fff4;
    padding: .8rem 1rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table__header .input-group {
    width: 45%; /* Adjust width to accommodate the image and input */
    height: 100%;
    background-color: #fff5;
    padding: 0 .8rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    align-items: center;
    transition: .2s;
}

.table__header .input-group:hover {
    width: 45%;
    background-color: #fff8;
    box-shadow: 0 .1rem .4rem #0002;
}

.table__header .input-group img {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.5rem; /* Provide space between image and input */
}

.table__header .input-group input {
    flex: 1; /* Allow input to expand within the container */
    padding: 0.5rem; /* Adjust padding for better spacing */
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1rem; /* Increase font size for placeholder and input text */
    color: #333; /* Adjust text color for better visibility */
}
::placeholder {
        font-size: 1rem; /* Increase placeholder font size */
        color: #aaa; /* Adjust placeholder color */
    }

.table__body {
    width: 95%;
    max-height: calc(89% - 1.6rem);
    background-color: #fffb;

    margin: .8rem auto;
    border-radius: .6rem;

    overflow: auto;
    overflow: overlay;
}

.table__body::-webkit-scrollbar{
    width: 0.5rem;
    height: 0.5rem;
}

.table__body::-webkit-scrollbar-thumb{
    border-radius: .5rem;
    background-color: #0004;
    visibility: hidden;
}

.table__body:hover::-webkit-scrollbar-thumb{
    visibility: visible;
}

table {
    width: 100%;
}

td img {
    width: 36px;
    height: 36px;
    margin-right: .5rem;
    border-radius: 50%;

    vertical-align: middle;
}

table, th, td {
    border-collapse: collapse;
    padding: 1rem;
    text-align: left;
}

thead th {
    position: sticky;
    top: 0;
    left: 0;
    background-color: #d5d1defe;
    cursor: pointer;
    text-transform: capitalize;
    width: calc(100% / 6); /* Distribute the width evenly among the six columns */
    text-align: center; /* Center align the text */
    padding: 0.5rem; /* Add some padding for better spacing */
}

tbody tr:nth-child(even) {
    background-color: #0000000b;
}

tbody tr {
    --delay: .1s;
    transition: .5s ease-in-out var(--delay), background-color 0s;
    width: calc(100% / 6); /* Distribute the width evenly among the six columns */
    text-align: center; /* Center align the text */
    padding: 0.5rem; /* Add some padding for better spacing */
}

tbody tr.hide {
    opacity: 0;
    transform: translateX(100%);
}

tbody tr:hover {
    background-color: #fff6 !important;
}

tbody tr td,
tbody tr td p,
tbody tr td img {
    transition: .2s ease-in-out;
}

tbody tr.hide td,
tbody tr.hide td p {
    padding: 0;
    font: 0 / 0 sans-serif;
    transition: .2s ease-in-out .5s;
}

tbody tr.hide td img {
    width: 0;
    height: 0;
    transition: .2s ease-in-out .5s;
}

.status {
    padding: .4rem 0;
    border-radius: 2rem;
    text-align: center;
}

.status.delivered {
    background-color: #86e49d;
    color: #006b21;
}

.status.cancelled {
    background-color: #d893a3;
    color: #b30021;
}

.status.pending {
    background-color: #ebc474;
}

.status.shipped {
    background-color: #6fcaea;
}


@media (max-width: 1000px) {
    td:not(:first-of-type) {
        min-width: 12.1rem;
    }
}

thead th span.icon-arrow {
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    border: 1.4px solid transparent;

    text-align: center;
    font-size: 1rem;

    margin-left: .5rem;
    transition: .2s ease-in-out;
}

thead th:hover span.icon-arrow{
    border: 1.4px solid #6c00bd;
}

thead th:hover {
    color: #6c00bd;
}

thead th.active span.icon-arrow{
    background-color: #6c00bd;
    color: #fff;
}

thead th.asc span.icon-arrow{
    transform: rotate(180deg);
}

thead th.active,tbody td.active {
    color: #6c00bd;
}

.export__file {
    position: relative;
}

.export__file .export__file-btn {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    transition: .2s ease-in-out;
}

.export__file .export__file-btn:hover {
    background-color: #fff;
    transform: scale(1.15);
    cursor: pointer;
}

.export__file input {
    display: none;
}

.export__file .export__file-options {
    position: absolute;
    right: 0;

    width: 12rem;
    border-radius: .5rem;
    overflow: hidden;
    text-align: center;

    opacity: 0;
    transform: scale(.8);
    transform-origin: top right;

    box-shadow: 0 .2rem .5rem #0004;

    transition: .2s;
}

.export__file input:checked + .export__file-options {
    opacity: 1;
    transform: scale(1);
    z-index: 100;
}

.export__file .export__file-options label{
    display: block;
    width: 100%;
    padding: .6rem 0;
    background-color: #f2f2f2;

    display: flex;
    justify-content: space-around;
    align-items: center;

    transition: .2s ease-in-out;
}

.export__file .export__file-options label:first-of-type{
    padding: 1rem 0;
    background-color: #86e49d !important;
}

.export__file .export__file-options label:hover{
    transform: scale(1.05);
    background-color: #fff;
    cursor: pointer;
}

.export__file .export__file-options img{
    width: 2rem;
    height: auto;
}


/*Input Bar*/
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

.form-group {
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


/* Add this style to hide the table initially */
.main.table {
  display: none;
}

.hide-search {
  display: none;
}

/*Print Image*/
.print-image {
  display: inline-block;
  /* Ensures the div takes only the required width */
}

.print-image img {
  width: 24px;
  /* Adjust the width of the print image */
  height: 24px;
  /* Adjust the height of the print image */
  cursor: pointer;
  /* Show pointer cursor on hover */
}
</style>
  
  
  