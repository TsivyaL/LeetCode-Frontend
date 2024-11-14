<template>
    <div class="question-details" v-if="question && question.title">
      <button @click="$emit('close')" class="close-btn">×</button>
      <h1 class="question-title">{{ question.title }}</h1>
      <p class="question-body">{{ question.body }}</p>
  
      <!-- Language Selection Dropdown -->
      <h4>Select Language:</h4>
      <select v-model="selectedLanguage">
        <option value="js">JavaScript</option>
        <option value="pyton">Python</option>
      </select>
  
      <!-- User Code Input -->
      <h4>Write Your Code Here:</h4>
      <textarea v-model="userCode" placeholder="Write your code here..." rows="10"></textarea>
      
      <button @click="submitCode">Submit Code</button>
  
      <!-- Output Section -->
      <h4>Output:</h4>
      <div class="output-window">
        {{ outputMessage }}
      </div>
  
      <!-- Show error message if any -->
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  
  // Define refs for question details, user input, and selected language
  const question = ref({})
  const userCode = ref('')
  const error = ref(null)
  const outputMessage = ref('') // message to show code execution result
  const selectedLanguage = ref('js') // default language set to JS
  const props = defineProps({
    id: String
  })
  
  // Watch for ID changes and fetch the new question data
  watch(() => props.id, async (newId) => {
    if (newId) {
      await fetchQuestion(newId)
    }
  })
  
  // Fetch the question details by ID
  const fetchQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/questions/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch question')
      }
      question.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error(err)
    }
  }
  
  // Function to handle code submission
  const submitCode = async () => {
    try {
        // API endpoint URL, יש לוודא את כתובת ה-URL בהתאם לסביבת העבודה
        const url = `http://localhost:8080/answers/${props.id}`;
  
        // Prepare answer data to send to the backend
        const answerData = {
            code: userCode.value,
            language: selectedLanguage.value
        };
  
        // Send answer to the backend
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answerData)
        });
  
        const result = await response.json();
  
        if (response.ok) {
            // Display message from backend response
            outputMessage.value = result.message;
            if (result.is_correct) {
                outputMessage.value += " 🎉 Correct answer!";
            } else {
                outputMessage.value += " ❌ Incorrect answer. Try again!";
            }
        } else {
            // Handle errors and display error message
            outputMessage.value = `Error: ${result.error}. ${result.details}`;
        }
    } catch (error) {
        outputMessage.value = `Submission failed: ${error.message}`;
    }
  }
  </script>
  
  <style scoped>
  /* Styles for layout, dropdown, buttons, and error display */
  .question-details {
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-left: 20px;
    flex: 1;
  }
  
  textarea, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #315a33;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #333;
  }
  .close-btn:hover {
    color: red;
  }
  
  .error {
    color: red;
  }
  
  .question-title {
    font-size: 2em; 
    font-weight: bold; 
    color: #333; 
    margin-bottom: 20px; 
  }
  
  .question-body {
    margin-bottom: 20px; 
  }
  
  .output-window {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
    height: 80px; /* Adjust the height as needed */
    background-color: #f9f9f9;
    overflow-y: auto;
    color: #333;
  }
  </style>
  