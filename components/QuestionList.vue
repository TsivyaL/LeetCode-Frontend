<template>
  <div class="question-list">
    <!-- List of questions -->
    <ul v-if="questions && questions.length">
      <li v-for="question in questions" :key="question.id" class="question-item">
        <p @click="openQuestion(question.id)">{{ question.title }}</p>
        <button @click.stop="deleteQuestion(question.id)" class="delete-btn">
          <i class="fas fa-trash-alt"></i>
        </button>
      </li>
    </ul>

    <!-- Question details component displayed next to the list -->
    <QuestionDetails v-if="selectedQuestionId" :id="selectedQuestionId" @close="selectedQuestionId = null" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QuestionDetails from './QuestionDetails.vue'

const questions = ref([])
const selectedQuestionId = ref(null)

// Fetch all questions from the server
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8080/questions')
    if (!response.ok) {
      throw new Error('Failed to fetch questions')
    }
    questions.value = await response.json()
  } catch (err) {
    console.error(err)
  }
})

// Open a specific question by ID
const openQuestion = (id) => {
  selectedQuestionId.value = id
}

// Delete a question by ID
const deleteQuestion = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/questions/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete question')
    }
    questions.value = questions.value.filter(question => question.id !== id)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
.question-list {
  display: flex;
  width: 100%;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 5px;
  min-height: 100vh;
}

.question-item {
  padding: 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.question-item:last-child {
  border-bottom: none;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ff0000;
}

.delete-btn i {
  font-size: 18px;
}
</style>
