<!-- layouts/dashboard.vue -->
<template>
    <div class="dashboard">
      <Sidebar />
      <div class="main-content">
        <div class="content">
          <NuxtPage />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '~/components/Sidebar.vue'
  import Navbar from '~/components/Navbar.vue'
  </script>
  <style scoped>
  .content {
    display: flex;
    flex-direction: column; 
    width: 88vw; 
    height: 100vh; /* תופס את כל הגובה של המסך */
    padding: 20px; /* מוסיף רווח פנימי */
    box-sizing: border-box; /* מתחשב ברווח הפנימי בתוך גודל ה-div */
  }
  
  .question-list-container {
    flex: 1; /* תופס את כל הגובה הנותר */
    overflow-y: auto; /* מוסיף גלילה אם התוכן גדול יותר מהגובה */
  }
  
  .question-details-container {
    flex: 1; /* תופס את כל הגובה הנותר */
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow-y: auto; /* גלילה אם התוכן גדול יותר מגובה האלמנט */
  }
  
  .add-question-btn {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    position: absolute; /* ישים את הכפתור בתחתית */
    bottom: 20px;
    left: 20px;
  }
  
  .add-question-btn:hover {
    background-color: #45a049;
  }
  
  .form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .form-container {
    width: 40%;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    font-size: 20px;
    color: #333;
    cursor: pointer;
  }
  
  .close-btn:hover {
    color: red;
  }
  </style>
  