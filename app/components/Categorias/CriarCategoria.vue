<template>
    <div class="form-container">
        <div class="form-title">
            <h1>
                criar categoria
            </h1>
        </div>
        <form @submit.prevent="createCategory">
            <div>
                <label for="name">Nome da categoria:</label>
                <input
                    type="text" id="name"
                    v-model="form.name"
                    required
                    placeholder="Digite o nome da categoria"
                />
            </div>
            <div>
                <button type="submit" :disable="loading">
                    {{ loading ? 'Salvando' : 'Criar Categoria' }}
                </button>
            </div>
            <div v-if="message" :class="messageType">
                {{ message }}
            </div>
        </form>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const form =  ref({
    name: ''
})

let loading = ref(false);
let message = ref('');
const messageType = ref('');

async function cleanForm(){
    form.value.name = '';
}

async function createCategory() {
    loading.value = true;
    message.value = '';

    try{
        const response = await axios.post('http://127.0.0.1:8000/api/categories/create/', {
            name: form.value.name
        });

        message.value = 'Categoria Criada com Sucesso!';
        messageType.value = 'success';

        // limpar o formulário
        cleanForm();

        console.log("Categoria criada: ", response.data);
    } catch(error) {
        message.value = error.response?.data?.error || 'Erro ao criar a categoria';
        messageType.value = 'error';

        console.error('Erro', error);
    } finally{
        loading.value = false;
    }
}

</script>

<style>

</style>