<template>
  <div class="question-details">
    <h3>{{ question.title }}</h3>
    <p>{{ question.body }}</p>

    <h4>Write Your Code Here:</h4>
    <textarea v-model="userCode" placeholder="Write your code here..." rows="10"></textarea>
    
    <button @click="submitCode">Submit Code</button>

    <!-- Show error message if any -->
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

// Define refs for question details and user input
const question = ref({})
const userCode = ref('')
const error = ref(null)

// Get question ID from route params
const { id } = useRoute().params
console.log('Question ID:', id)  // Check if the ID is available

// Fetch the question details when the component is mounted
onMounted(async () => {
  console.log('Component mounted')  // Log when the component is mounted

  try {
    if (!id) {
      console.error('No question ID provided') // If no ID is found
      throw new Error('No question ID provided')
    }

    const response = await fetch(`http://localhost:8080/questions/${id}`)
    console.log('Fetched data:', response)  // See if a request was sent to the server
    if (!response.ok) {
      throw new Error('Failed to fetch question')
    }
    question.value = await response.json()
    console.log('Question:', question.value)  // Make sure data is returned correctly

  } catch (err) {
    error.value = err.message
    console.error('Error:', err)  // Print the error if there's one
  }
})

// Function to handle code submission
const submitCode = () => {
  // Here you would typically send userCode to the server to test it
  console.log('Code submitted:', userCode.value)
}

// You may define a page layout here if needed
definePageMeta({
  layout: 'dashboard' // The 'dashboard' layout will be applied to this page
})
</script>

<style scoped>
.question-details {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

textarea {
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: monospace;
  font-size: 14px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
}
</style>
