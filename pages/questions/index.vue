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
  
      <!-- Filters -->
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
        <USelectMenu v-model="selectedStatus" :options="statusOptions" multiple placeholder="Status" class="w-40" />
      </div>
  
      <!-- Table -->
      <UTable
        v-model="selectedRows"
        v-model:sort="sort"
        :rows="questions"
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
          <UBadge size="xs" :label="row.completed ? 'Completed' : 'In Progress'" :color="row.completed ? 'emerald' : 'orange'" variant="subtle" />
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
              icon="faCode"
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
            v-model="page"
            :page-count="pageCount"
            :total="pageTotal"
            :ui="paginationUI"
          />
        </div>
      </template>
    </UCard>
  
    <!-- Add Question Form (Overlay) -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <AddQuestionForm @close="closeForm" @submit="addNewQuestion" />
        <button class="close-btn" @click="closeForm">X</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import AddQuestionForm from '~/components/AddQuestionForm.vue'
  import QuestionDetails from '~/components/QuestionDetails.vue'
  import { useRouter } from 'vue-router'
  
  const questions = ref([])
  const selectedQuestionId = ref(null)
  const search = ref('')
  const selectedStatus = ref([])
  const page = ref(1)
  const pageCount = ref(10)
  const pageTotal = ref(200) // Dynamic total from the server
  const sort = ref({ column: 'title', direction: 'asc' })
  const showForm = ref(false)
  
  // Columns for the table
  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ]
  
  const statusOptions = [
    { key: 'completed', label: 'Completed', value: true },
    { key: 'inProgress', label: 'In Progress', value: false },
  ]
  
  const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
  const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))
  
  // Fetch questions from the API
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
  
  // Open the solve page when clicking SOLVE
  const router = useRouter()
  
  const goToSolvePage = (questionId) => {
    if (questionId) {
      router.push(`/solve/${questionId}`)
    } else {
      console.error("Invalid question ID")
    }
  }
  
  // Delete a question by ID
  const deleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/questions/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete question')
      }
      questions.value = questions.value.filter((question) => question.id !== id)
    } catch (err) {
      console.error(err)
    }
  }
  
  // Handle row selection
  const selectedRows = ref([])
  function select(row) {
    const index = selectedRows.value.findIndex((item) => item.id === row.id)
    if (index === -1) {
      selectedRows.value.push(row)
    } else {
      selectedRows.value.splice(index, 1)
    }
  }
  
  // Computed pagination UI object
  const paginationUI = computed(() => ({
    wrapper: 'flex items-center gap-1',
    rounded: '!rounded-full min-w-[32px] justify-center',
    default: { activeButton: { variant: 'outline' } }
  }))
  
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
    questions.value.push(newQuestion)
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
  