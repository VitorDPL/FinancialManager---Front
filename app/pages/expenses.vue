<template>
    <h1>Gastos</h1>
    <h2>Subtítulo</h2>
    <p>Parágrafo</p>

    {{ content }}
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const content = ref(null);

async function getContent(){
    const response = await axios.get('http://127.0.0.1:8000/api/expenses/home/');
    content.value = response.data;

    console.log("Conteúdo: ", content.value);
    console.log("Conteúdo: ", response.data);

    return content;
}

onMounted(() =>{
    getContent();

})
</script>