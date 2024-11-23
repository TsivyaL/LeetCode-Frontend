<template>
  <div class="question-details" v-if="question && question.title">
    <!-- Question title and body -->
    <h1 class="question-title">{{ question.title }}</h1>
    <p class="question-body">{{ question.body }}</p>

    <!-- Language Selection Dropdown -->
    <h4>Select Language:</h4>
    <select v-model="selectedLanguage" @change="updateFunctionSignature">
      <option value="js">JavaScript</option>
      <option value="python">Python</option>
    </select>

    <!-- CodeMirror editor -->
    <h4>Write Your Code Here:</h4>
    <div ref="editor" style="height: 300px;"></div>

    <!-- Submit button with loading state -->
    <button @click="submitCode" :disabled="isSubmitting">
      <span v-if="isSubmitting">Submitting... <span class="spinner"></span></span>
      <span v-else> <i class="codicon codicon-run-above"></i> Submit Code</span>
    </button>

    <!-- Output and error message -->
    <h4>Output:</h4>
    <div class="output-window">
      {{ outputMessage }}
    </div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Back to Questions button -->
    <button @click="goBackToQuestions" class="back-button">
      <i class="codicon codicon-arrow-left"></i> Back to Questions
    </button>
  </div>
</template>

<script setup>
// Vue Composition API hooks
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EditorView, basicSetup } from "codemirror";
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { EditorState } from '@codemirror/state'

// Define state variables
const question = ref({})
const error = ref(null)
const outputMessage = ref('')
const selectedLanguage = ref('js')
const isSubmitting = ref(false) // To track submission status
const editor = ref(null)
let editorView = null
let userCode = ref('')
const route = useRoute()
const router = useRouter() // Add useRouter to navigate
const questionId = route.params.questionId

// Watch for questionId changes and fetch new question data
watch(() => questionId, async (newId) => {
  if (newId) {
    await fetchQuestion(newId)
  }
})

// Fetch question data from the backend
const fetchQuestion = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/questions/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch question')
    }
    question.value = await response.json()
    updateFunctionSignature()
  } catch (err) {
    error.value = err.message
    console.error(err)
  }
}

// Update function signature based on selected language
const updateFunctionSignature = () => {
  const signature = question.value.function_signature || ''
  if (selectedLanguage.value === 'js') {
    userCode.value = `function solution(${signature}) {\n  // Write your solution here\n}`
    createOrUpdateEditor(javascript())
  } else if (selectedLanguage.value === 'python') {
    userCode.value = `def solution(${signature}):\n    # Write your solution here\n`
    createOrUpdateEditor(python())
  }
}

// Create or update the CodeMirror editor
const createOrUpdateEditor = (mode) => {
  nextTick(() => {
    if (editorView) {
      editorView.setState(EditorState.create({
        doc: userCode.value,
        extensions: [basicSetup, mode]
      }))
    } else {
      editorView = new EditorView({
        state: EditorState.create({
          doc: userCode.value,
          extensions: [basicSetup, mode]
        }),
        parent: editor.value
      })
    }
  })
}

// Handle code submission
const submitCode = async () => {
  isSubmitting.value = true // Show the spinner while submitting
  outputMessage.value = 'Submitting your code... Please wait.' // Show wait message

  const userCodeToSubmit = editorView.state.doc.toString()

  try {
    const url = `http://localhost:8080/answers/${questionId}`
    const answerData = {
      code: userCodeToSubmit,
      language: selectedLanguage.value
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerData)
    })

    const result = await response.json()

    if (response.ok) {
      outputMessage.value = result.message
      if (result.is_correct) {
        outputMessage.value += " 🎉 Correct answer!"
      } else {
        outputMessage.value += " ❌ Incorrect answer. Try again!"
      }
    } else {
      outputMessage.value = `Error: ${result.error}. ${result.details}`
    }
  } catch (error) {
    outputMessage.value = `Submission failed: ${error.message}`
  } finally {
    isSubmitting.value = false // Hide the spinner once done
  }
}

// Reset the output when starting to type or change the language
const resetOutput = () => {
  outputMessage.value = ''
  error.value = null
}

// Watch for changes in editor content or language change
watch([() => userCode.value, () => selectedLanguage.value], resetOutput)

onMounted(async () => {
  if (questionId) {
    await fetchQuestion(questionId)
  }
})

// Go back to the questions page
const goBackToQuestions = () => {
  router.push('/questions') // Navigate to the questions page
}
</script>

<style scoped>
/* Style the question details container */
.question-details {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-left: 20px;
  flex: 1;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

/* Style for input elements like textarea and select */
textarea, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Style the submit button */
button {
  padding: 10px 20px;
  background-color: #315a33;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Back button styling */
.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2d3748;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Spinner animation */
.spinner {
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error message styling */
.error {
  color: red;
}

/* Output window styling */
.output-window {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
  height: 80px;
  background-color: #f9f9f9;
  overflow-y: auto;
  color: #333;
}
</style>
