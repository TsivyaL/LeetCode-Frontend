<template>
  <UCard
    class="w-full"
    :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
      footer: { padding: 'p-4' }
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
          Questions
        </h2>
        <button @click="toggleForm" class="add-question-btn">Add Question</button>
      </div>
    </template>

    <!-- Table -->
    <UTable
      v-model="selectedRows"
      v-model:sort="sort"
      :rows="pagedQuestions"
      :columns="columns"
      :loading="status === 'pending'"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      @select="select"
    >
      <template #title-data="{ row }">
        <p @click="openQuestion(row.id)" class="cursor-pointer text-blue-600">{{ row.title }}</p>
      </template>

      <template #status-data="{ row }">
        <UBadge 
            size="xs" 
          :label="row.status === 'Completed' ? 'Completed' : (row.status === 'In Progress' ? 'In Progress' : 'Not Started')" 
          :color="row.status === 'Completed' ? 'emerald' : (row.status === 'In Progress' ? 'orange' : 'gray')" 
          variant="subtle" 
/>

      </template>

      <template #actions-data="{ row }">
        <div class="flex space-x-2">
          <UButton
            icon="i-heroicons-trash"
            size="2xs"
            color="red"
            variant="outline"
            :ui="{ rounded: 'rounded-full' }"
            square
            @click.stop="deleteQuestion(row.id)"
          />
          <UButton
            icon="codicon:code"
            size="2xs"
            color="blue"
            variant="outline"
            :ui="{ rounded: 'rounded-full' }"
            square
            @click.stop="goToSolvePage(row.id)"
          />
        </div>
      </template>
    </UTable>

    <!-- Question details component displayed next to the list -->
    <QuestionDetails v-if="selectedQuestionId" :id="selectedQuestionId" @close="selectedQuestionId = null" />

    <!-- Pagination and Number of rows -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <span class="text-sm leading-5">
            Showing
            <span class="font-medium">{{ pageFrom }}</span>
            to
            <span class="font-medium">{{ pageTo }}</span>
            of
            <span class="font-medium">{{ pageTotal }}</span>
            results
          </span>
        </div>

        <UPagination
          v-if="pageTotal > 0 && pageTo < pageTotal"
          v-model="page"
          :page-count="Math.ceil(pageTotal / pageCount)"
          :total="pageTotal"
          :ui="paginationUI"
        />
      </div>
    </template>
  </UCard>

  <!-- Add Question Form (Overlay) -->
  <div v-if="showForm" class="form-overlay" @click.self="closeForm">
    <div class="form-container">
      <AddQuestionForm @close="closeForm" @submit="addNewQuestion" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AddQuestionForm from '~/components/AddQuestionForm.vue'
import { useRouter } from 'vue-router'

const questions = ref([]) 
const selectedQuestionId = ref(null)
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0)  // Adjust dynamically based on fetched data
const sort = ref({ column: 'title', direction: 'asc' })
const showForm = ref(false)

// Columns for the table
const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
]

const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Get paginated questions
const pagedQuestions = computed(() => {
  const start = (page.value - 1) * pageCount.value
  return questions.value.slice(start, start + pageCount.value)
})

// Fetch questions from the API
const fetchQuestions = async () => {
  try {
    const response = await fetch('http://localhost:8080/questions')
    if (!response.ok) throw new Error('Failed to fetch questions')
    const data = await response.json()
    if (Array.isArray(data)) {
      questions.value = data
      pageTotal.value = data.length  // Update total questions dynamically
    } else {
      console.error('Data is not an array:', data)
    }
  } catch (err) {
    console.error(err)
  }
}


onMounted(fetchQuestions)

// Open a specific question by ID
const openQuestion = (id) => {
  selectedQuestionId.value = id
}

// Navigate to solve page
const router = useRouter()
const goToSolvePage = (questionId) => {
  if (questionId) router.push(`/solve/${questionId}`)
}

// Delete a question by ID
const deleteQuestion = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/questions/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete question')
    questions.value = questions.value.filter((question) => question.id !== id)
    pageTotal.value = questions.value.length  // Update total questions after deletion
  } catch (err) {
    console.error(err)
  }
}

// Toggle form visibility
const toggleForm = () => {
  showForm.value = !showForm.value
}

// Close form and refresh questions
const closeForm = () => {
  showForm.value = false
  fetchQuestions()
}

// Add new question
const addNewQuestion = (newQuestion) => {
  questions.value.push(newQuestion)
  pageTotal.value = questions.value.length  // Update total questions after adding
}
</script>

<style scoped>
.add-question-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
}
</style>
