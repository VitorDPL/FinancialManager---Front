<template>
    <AdicionarGastos />
    <div class="gastos">
        <GraficoGastos />
    </div>
</template>

<script setup>
import AdicionarGastos from '~/components/Gastos/AdicionarGastos.vue';
import GraficoGastos from '~/components/Gastos/GraficoGastos.vue';

</script>

<style scoped>
.gastos{
    display: flex;
}
</style>