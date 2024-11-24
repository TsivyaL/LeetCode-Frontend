<template >
  <div v-if="showForm" class="question-form" @click.self="closeForm">
    <!-- Close button (X) to close the form without saving -->
    <button @click="closeForm" class="close-btn">X</button>

    <h3>Add a New Question</h3>
    <form @submit.prevent="submitQuestion">
      <label for="title">Title</label>
      <input type="text" v-model="newQuestion.title" id="title" required />

      <label for="body">Body</label>
      <textarea v-model="newQuestion.body" id="body" required></textarea>

      <label for="inputs">Inputs</label>
      <textarea v-model="newQuestion.inputs" id="inputs" required placeholder="Example: [[1, 2], ['Hello', 'World']]" @input="validateInputs"></textarea>
      <span v-if="!isInputsValid" class="error-message">Expected format: Array of arrays, e.g. [[1, 2], ['Hello', 'World']]</span>

      <label for="expectedOutputs">Expected Outputs</label>
      <textarea v-model="newQuestion.expected_outputs" id="expectedOutputs" required placeholder="Example: [3, 'HelloWorld']" @input="validateExpectedOutputs"></textarea>
      <span v-if="!isExpectedOutputsValid" class="error-message">Expected format: Array, e.g. [3, 'HelloWorld']</span>

      <label for="functionSignature">Function Signature</label>
      <input type="text" v-model="newQuestion.function_signature" id="functionSignature" required />

      <button class="submit-btn" type="submit" :disabled="!isFormValid">Submit Question</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Define the form data
const newQuestion = ref({
  title: '',
  body: '',
  inputs: '',
  expected_outputs: '',
  function_signature: ''
})
let showForm = ref(true)
const isFormValid = ref(true)
const isInputsValid = ref(true)
const isExpectedOutputsValid = ref(true)

// Emit function to handle form closure and submission
const emit = defineEmits(['closeForm', 'addQuestion'])

// Function to validate the inputs format
const validateInputs = () => {
  try {
    // Try to parse the inputs as a 2D array
    const parsedInputs = JSON.parse(newQuestion.value.inputs)
    if (Array.isArray(parsedInputs) && parsedInputs.every(item => Array.isArray(item))) {
      isInputsValid.value = true
    } else {
      isInputsValid.value = false
    }
  } catch (error) {
    isInputsValid.value = false
  }
  // Update form validity
  isFormValid.value = isInputsValid.value && isExpectedOutputsValid.value
}

// Function to validate the expected outputs format
const validateExpectedOutputs = () => {
  try {
    // Try to parse the expected outputs as an array
    const parsedOutputs = JSON.parse(newQuestion.value.expected_outputs)
    if (Array.isArray(parsedOutputs)) {
      isExpectedOutputsValid.value = true
    } else {
      isExpectedOutputsValid.value = false
    }
  } catch (error) {
    isExpectedOutputsValid.value = false
  }
  // Update form validity
  isFormValid.value = isInputsValid.value && isExpectedOutputsValid.value
}

// Function to submit the form and send data to the API
const submitQuestion = async () => {
  const questionData = {
    title: newQuestion.value.title,
    body: newQuestion.value.body,
    inputs: JSON.parse(newQuestion.value.inputs),
    expected_outputs: JSON.parse(newQuestion.value.expected_outputs),
    function_signature: newQuestion.value.function_signature
  }

  try {
    const response = await fetch('http://localhost:8080/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionData)
    })

    if (!response.ok) {
      throw new Error('Failed to add question')
    }

    // Emit event to add the question to the list
    emit('addQuestion', questionData)

    // Close the form after successful submission
    closeForm()

    alert('Question added successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to add question: ' + err.message)
  }
}

// Function to close the form without saving
const closeForm = () => {
  emit('closeForm')
  showForm.value = false
  // Reset the form data to cancel any changes
  newQuestion.value = { title: '', body: '', inputs: '', expected_outputs: '', function_signature: '' }
}
</script>

<style scoped>
.question-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  position: relative;
}

.question-form label {
  display: block;
  margin-top: 10px;
}

.question-form input,
.question-form textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.question-form input.invalid,
.question-form textarea.invalid {
  border-color: red;
  background-color: #f8d7da;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}

.submit-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
  background-color: #fff;
}

.close-btn:hover {
  color: #f00;
}
</style>
