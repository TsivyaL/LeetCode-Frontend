<template>
  <div class="welcome-container">
    <div class="overlay">
      <h2>Welcome to the Dashboard</h2>
      <p>In this system, users will have the ability to interact with questions through CRUD operations and test their answers to ensure accuracy, similar to leetcode.com.</p>
      <UButton 
        class="navigate-button" 
        @click="goToQuestions"
        icon="i-heroicons-arrow-right"
        size="lg"
        color="blue"
      >
        Go to Questions
      </UButton>
    </div>
  </div>
</template>

<script setup>
// Importing useRouter from vue-router
import { useRouter } from 'vue-router'

// Creating an instance of router
const router = useRouter()

// Navigate to the questions page
const goToQuestions = () => {
  // Routing to the questions page
  router.push('/questions')
}
</script>

<style scoped>
.welcome-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url('https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010119.jpg?t=st=1732383388~exp=1732386988~hmac=e06481a676c8bb7a9b64caf3f1cf5738d894f55d90f745167a278b35a237d6ae&w=1060');
  background-size: cover; /* Make the background image cover the entire container */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent repetition */
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5); /* Make the overlay semi-transparent */
  padding: 20px;
  border-radius: 10px; /* Optional: round the corners of the overlay */
  max-width: 80%; /* Optional: limit the width of the overlay */
}

.overlay h2 {
  font-size: 2.5rem; /* Increase the font size for the header */
  font-weight: bold;
  margin-bottom: 10px;
}

.overlay p {
  font-size: 1.25rem; /* Make the paragraph font size larger */
  margin-bottom: 20px;
}

.navigate-button {
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.1rem; /* Increase the font size for the button */
  padding: 10px 20px; /* Add more padding to the button */
  background-color: #3e5279;
}
</style>
