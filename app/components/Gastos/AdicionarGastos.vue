<template>
    <div class="form-container">
        <div class="form-title">
            <h1>Adicionar novo valor</h1>
        </div>
        <div class="forms">
            <form @submit.prevent="createExpense">
                <div class="inputs">
                    <label for="name">Nome: </label>
                    <input type="text" id="name" v-model="form.name" required placeholder="Digite o que você comprou">
                </div>

                <div class="inputs">
                    <label for="category">Categoria</label>
                    <div class="category-flex">
                        <select id="category" v-model="form.category" required>
                            <option value="">Selecione uma categoria</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="inputs">
                    <label for="value">Valor</label>
                    <input type="number" id="value" v-model="form.value" required placeholder="Digite o valor da compra">
                </div>

                <div class="inputs">
                    <label for="type_expense">À vista ou parcelado</label>
                    <select id="type_expense" v-model="form.type_expense" required>
                        <option value="">Selecione o tipo:</option>
                        <option value="à vista">À vista</option>
                        <option value="parcelado">Parcelado</option>
                    </select>
                </div>

                <div class="inputs" v-if="form.type_expense == 'parcelado'">

                        <label for="type_expense">Número de parcelas</label>
                        <input type="number" id="type_expense" required v-model="form.number_of_installments">

                </div>

                <div class="inputs">
                    <label for="date">Data</label>
                    <Calendar v-model="date" id="date"/>
                </div>

                <div class="button">
                    <button type="submit" :disabled="loading">
                        Salvar
                    </button>
                </div>

            </form>
            
            <div v-if="message">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

let loading = ref(false);
let message = ref('');
const categories = ref([]);
const date = ref(new Date()     );
const form = ref({
    name: '',
    category: null,
    value: null,
    type_expense: 'à vista',
    date: date,

    number_of_installments: null
})

async function getCategories(){
    try{
        const response = await axios.get("http://127.0.0.1:8000/api/categories/read/");
        categories.value = response.data;
    } catch(error){
        message.value = error.response?.data?.error || 'Erro ao listar as categorias';
    } 
}

async function createExpense(){
    try{
        loading = true;

        console.log("valor de type: ", form.value.type_expense);

        if(form.value.type_expense=='parcelado'){
            const response = await axios.post("http://127.0.0.1:8000/api/expenses/create/", {
                name: form.value.name,
                category: form.value.category,
                value: parseFloat(form.value.value),
                type_expense: form.value.type_expense,
                date: formatDateToSave(date.value),
                number_of_installments: form.value.number_of_installments
            });
        }else{
            const response = await axios.post("http://127.0.0.1:8000/api/expenses/create/", {
                name: form.value.name,
                category: form.value.category,
                value: parseFloat(form.value.value),
                type_expense: form.value.type_expense,
                date: formatDateToSave(date.value)
            });
        }

        form.value.name= "";
        form.value.category = null;
        form.value.value = null;
        form.value.number_of_installments = null
        
        message.value = "Valor incluso com sucesso!";

        setTimeout(() => {
            message.value = ""
        }, 2000)

    }catch(error){
        console.log("Erro: ", error);
    }finally{
        loading=false;
    }
}

function formatDateToSave(date){
    // converte a data para o formato americano para que seja salvo no banco
    try{
        if(!date) return null;

        return date.toISOString().split('T')[0];
    }catch(error){
        console.error("Erro ao converter a data: ", error);
    }
}

onMounted(() => {
    getCategories();
})

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