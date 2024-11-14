<!-- layouts/dashboard.vue -->
<template>
    <div class="dashboard">
      <Sidebar />
      <div class="main-content">
        <Navbar />
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
  