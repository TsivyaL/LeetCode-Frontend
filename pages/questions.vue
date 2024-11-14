<template>
  <div class="questions-container">
    <!-- Show AddQuestionForm component when 'showForm' is true -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <button @click="closeForm" class="close-btn">X</button>
        <AddQuestionForm @closeForm="closeForm" @addQuestion="addNewQuestion" />
      </div>
    </div>

    <!-- Sidebar for question list -->
    <div class="question-list-container">
      <QuestionList />
    </div>
  </div>

  <!-- Add Question Button (outside the flex layout for proper placement) -->
  <button @click="toggleForm" class="add-question-btn">Add Question</button>
</template>

<script setup>
import { ref } from 'vue'
import AddQuestionForm from '~/components/AddQuestionForm.vue'
import QuestionList from '~/components/QuestionList.vue'

const showForm = ref(false)

// Form visibility
const toggleForm = () => {
  showForm.value = !showForm.value
}

// Close the form after submission
const closeForm = () => {
  showForm.value = false
}

// Add new question to the list after form submission
const addNewQuestion = async (newQuestion) => {

    questions.value.push(newQuestion)
}
</script>

<style scoped>
.questions-container {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  margin-bottom: 20px; /* Add space below the container */
  position: relative; /* Maintain relative position for the absolute button */
}

.question-list-container {
  flex: 1;
}

.add-question-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute; /* Place the button outside the flex container */
  bottom: 20px;
  left: 20px;
}

.add-question-btn:hover {
  background-color: #45a049;
}

.form-overlay {
  position: fixed; /* Place the form overlay on top of the page */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  width: 40%; /* Adjust width of the form container */
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
