<template>
    <h1>
        Gastos
    </h1>

    
    <div v-if="data.length">
        {{ data }}
    </div>


    <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';


const data = ref([]);

// chart vars
const chartData = ref();
const chartOptions = ref();

async function getExpenses(){
    try{
        const response = await axios.get("http://127.0.0.1:8000/api/expenses/get/");
        data.value = response.data;

        chartData.value = setChartData(data.value);
    }catch(error){
        console.error("Erro ao recuperar os gastos existentes: ", error);
    }
}

// chart functions
const setChartData = ( expenses = [] ) => {
    const labels = expenses.map( e=> e.name);
    const values = expenses.map( e=> parseFloat(e.value)  || 0);

    const bg = ['rgba(249,115,22,0.2)','rgba(6,182,212,0.2)','rgba(107,114,128,0.2)','rgba(139,92,246,0.2)'];
    const bd = ['rgb(249,115,22)','rgb(6,182,212)','rgb(107,114,128)','rgb(139,92,246)'];
    const backgroundColor = labels.map((_, i) => bg[i % bg.length]);
    const borderColor = labels.map((_, i) => bd[i % bd.length]);
    return {
        labels: labels,
        datasets: [
            {
                label: 'Gastos',
                data: values,
                backgroundColor: backgroundColor,
                borderColor: borderColor
            }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

onMounted(() => {
    getExpenses();

    // gráficos
    chartOptions.value = setChartOptions();

})
</script>