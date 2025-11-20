<!-- exemplo prático de watch + computed juntos -->
<!-- https://www.youtube.com/watch?v=FcBpoeWsErs -->
<template>
  <div>
    <h2>Carrinho</h2>

    <label>
      Item 1: <input type="number" v-model.number="item1">
    </label>
    <br>
    <label>
      Item 2: <input type="number" v-model.number="item2">
    </label>

    <p>Total: {{ total }}</p>
    <p v-if="alerta" style="color: red;">Limite ultrapassado!</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const item1 = ref(0)
const item2 = ref(0)
const alerta = ref(false)

// Computed: recalcula automaticamente quando item1 ou item2 muda
const total = computed(() => item1.value + item2.value)

// Watch: observa o total e toma ação se ultrapassar 100
watch(total, (novoValor) => {
  alerta.value = novoValor > 100
})
</script>
