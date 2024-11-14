<template>
  <div class="questions-container">
    <!-- Sidebar for question list -->
    <div class="question-list-container">
      <QuestionList @selectQuestion="selectedQuestionId = $event" />
    </div>

    <!-- Question details container (appears beside the question list) -->
    <div v-if="selectedQuestionId" class="question-details-container">
      <QuestionDetails :id="selectedQuestionId" @close="selectedQuestionId = null" />
    </div>

    <!-- Add Question Form Overlay -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <button @click="closeForm" class="close-btn">X</button>
        <AddQuestionForm @closeForm="closeForm" @addQuestion="addNewQuestion" />
      </div>
    </div>
  </div>

  <!-- Add Question Button -->
  <button @click="toggleForm" class="add-question-btn">Add Question</button>
</template>

<script setup>
import { ref } from 'vue'
import AddQuestionForm from '~/components/AddQuestionForm.vue'
import QuestionList from '~/components/QuestionList.vue'
import QuestionDetails from '~/components/QuestionDetails.vue'

const showForm = ref(false)
const selectedQuestionId = ref(null)

// Toggle form visibility
const toggleForm = () => {
  showForm.value = !showForm.value
}

// Close the form after submission
const closeForm = () => {
  showForm.value = false
}

// Add new question to the list after form submission
const addNewQuestion = (newQuestion) => {
  // Add the new question to the list if needed
    questions.value.push(newQuestion)
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.questions-container {
  display: flex;
  gap: 20px;
  height: 86vh; /* Full viewport height */
  width: 88vw; /* Full viewport width */
  align-items: flex-start;
  position: relative;
  /* overflow: hidden; Avoids overflow on the page */
}

.question-list-container {
  flex: 1;
  height: 100%;
  overflow-y: auto; /* Enable scrolling */
}

.question-details-container {
  flex: 2;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto; /* Enable scrolling */
}

.add-question-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: fixed;
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