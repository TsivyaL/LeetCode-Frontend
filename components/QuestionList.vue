<template>
    <div class="question-list">
      <div v-if="loading">Loading questions...</div>
      <div v-else>
        <ul v-if="questions && questions.length">
          <li v-for="question in questions" :key="question.id" class="question-item">
            <nuxt-link :to="`/questions/${question.id}`">
              <p>{{ question.title }}</p>
            </nuxt-link>
            <!-- Delete icon button -->
            <button @click="deleteQuestion(question.id)" class="delete-btn">
              <i class="fas fa-trash-alt"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const questions = ref([])
  const loading = ref(true)
  
  // Fetch all questions
  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:8080/questions')
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      questions.value = await response.json()
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  })
  
  // Delete question by id
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
    width: 100%;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 5px;
    min-height: 100vh;
    overflow-y: auto;
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
  