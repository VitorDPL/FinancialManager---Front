<template>
  <main>

    <div class="container">
      
      <div class="title">
        <h1>Gastos por Mês</h1>
      </div>
    <div class="calendar">
      <p>Insira o período: </p>
      <div class="">
          <Calendar v-model="dates" selectionMode="range" :manualInput="false" date-format="mm/yy"/>
      </div>
    </div>
        
      <div class="container-get">
        <div class="card" v-if="chartData">
          <Chart type="bar" :data="chartData" :options="chartOptions" />
        </div>
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        </DataTable>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' // adicionar watch
import { useExpenseStore } from '@/stores/expense'
import Chart from 'primevue/chart'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const dates = ref()
const store = useExpenseStore()
const chartOptions = ref()
const selectedDate = ref(null)
const products = ref([]) // inicializar como array vazio
const columns = [
    { field: 'name', header: 'Nome' },
    { field: 'category', header: 'Categoria' },
    { field: 'value', header: 'Valor' },
    { field: 'date', header: 'Data' }
]

const chartData = computed(() => setChartData(store.expenses))

onMounted(async () => {
  await store.getExpensesPerMonth()
  chartOptions.value = setChartOptions()

  // carregar dados do mês atual para a tabela
  await store.getExpensesUniqueMonth()
  products.value = store.monthExpenses
})

watch(dates, async(newDates) => {
  if (newDates){
    await store.getExpensesPerMonth(newDates)
  }
}, {deep: true})

watch(selectedDate, async(newDate) => {
  if (newDate) {
    console.log("Buscando gastos para:", newDate)
    await store.getExpensesUniqueMonth(newDate)
    // CORREÇÃO: usar monthExpenses em vez de data.expenses
    products.value = store.monthExpenses
  }
}, {deep: true})

function setChartData(expenses) {
  const labels = expenses.labels || []
  const values = expenses.data || []

  const bg = [
    'rgba(249,115,22,0.2)',
    'rgba(6,182,212,0.2)',
    'rgba(107,114,128,0.2)',
    'rgba(139,92,246,0.2)'
  ]
  const bd = [
    'rgb(249,115,22)',
    'rgb(6,182,212)',
    'rgb(107,114,128)',
    'rgb(139,92,246)'
  ]
  return {
    labels,
    datasets: [
      {
        label: 'Gastos (R$)',
        data: values,
        backgroundColor: labels.map((_, i) => bg[i % bg.length]),
        borderColor: labels.map((_, i) => bd[i % bd.length]),
        borderWidth: 1
      }
    ]
  }
}

function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    plugins: {
      legend: { display: false }
    },
    onClick: (event, activeElements) => {
      if (activeElements.length > 0) {
        const clickedIndex = activeElements[0].index
        const clickedLabel = chartData.value.labels[clickedIndex]
        
        handleLabelClick(clickedLabel)
      }
    },
    scales: { // remover duplicação
      x: {
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder }
      },
      y: {
        beginAtZero: true,
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder }
      }
    }
  }
}

function handleLabelClick(label) {
  console.log(`Você clicou em: ${label}`)
  selectedDate.value = label
}
</script>

<style scoped>
.card {
  width: 40vw;
  margin: auto;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.container-get{
  display: flex;
}

.calendar{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
