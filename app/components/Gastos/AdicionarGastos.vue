<template>
  <main>
      <div class="form-container">
        <div class="form-title">
          <h1>Adicionar novo valor</h1>
        </div>
        <div class="forms">
          <form @submit.prevent="createExpense">
            <div class="inputs">
              <label for="name">Nome:</label>
              <input
                id="name"
                type="text"
                v-model="form.name"
                required
                placeholder="Digite o que você comprou"
              />
            </div>
            <div class="inputs">
              <label for="category">Categoria</label>
              <div class="category-flex">
                <select id="category" v-model="form.category" required>
                  <option value="">Selecione uma categoria</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="inputs">
              <label for="value">Valor</label>
              <input
                id="value"
                type="number"
                v-model="form.value"
                required
                placeholder="Digite o valor da compra"
              />
            </div>
            <div class="inputs">
              <label for="type_expense">À vista ou parcelado</label>
              <select id="type_expense" v-model="form.type_expense" required>
                <option value="">Selecione o tipo:</option>
                <option value="à vista">À vista</option>
                <option value="parcelado">Parcelado</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
            <div class="inputs" v-if="form.type_expense === 'parcelado'">
              <label for="installments">Número de parcelas</label>
              <input
                id="installments"
                type="number"
                required
                v-model="form.number_of_installments"
              />
            </div>
            <div class="inputs">
              <label for="date">Data</label>
              <Calendar v-model="date" id="date" />
            </div>
            <div class="button">
              <button type="submit" :disabled="loading">Salvar</button>
            </div>
          </form>
          <div v-if="message">{{ message }}</div>
        </div>
      </div>
  </main>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { useExpenseStore } from '@/stores/expense'

const store = useExpenseStore()

const loading = ref(false)
const message = ref('')
const categories = ref([])
const date = ref(new Date())

const form = reactive({
  name: '',
  category: null,
  value: null,
  type_expense: 'à vista',
  number_of_installments: null,
})

async function getCategories() {
  try {
    const { data } = await axios.get('http://127.0.0.1:8000/api/categories/read/')
    categories.value = data
  } catch (error) {
    message.value = error.response?.data?.error || 'Erro ao listar categorias'
  }
}

function buildPayload() {
  const base = {
    name: form.name,
    category: form.category,
    value: parseFloat(form.value),
    type_expense: form.type_expense,
    date: formatDateToSave(date.value),
  }

  if (form.type_expense === 'parcelado') {
    base.number_of_installments = form.number_of_installments
  }

  return base
}

async function createExpense() {
  try {
    loading.value = true
    const payload = buildPayload()
    await store.addExpense(payload)

    // Limpa o formulário
    form.name = ''
    form.category = null
    form.value = null
    form.number_of_installments = null

    message.value = 'Valor incluso com sucesso!'
    setTimeout(() => (message.value = ''), 2000)
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    loading.value = false
  }
}

function formatDateToSave(d) {
  if (!d) return null
  return d.toISOString().split('T')[0]
}

onMounted(getCategories)
</script>

<style scoped>
.forms form{
    margin-top: 1rem;
    display: flex;
    gap: 2rem;
    align-items: flex-end;
    justify-content: space-between;
}

.inputs{
    display: flex;
    flex-direction: column;
}

.inputs input, select, button{
    width: 15rem;
    min-height: 3rem;
    border-radius: 1rem;
}

.inputs :deep(.p-inputtext.p-component.p-filled.p-variant-filled.p-datepicker-input) {
    width: 15rem !important;
    min-height: 4rem !important;
    margin: 0;
}

.category-flex{
    display: flex;
    gap:1rem;
}

.category-flex button{
    width: 3rem;
}
</style>