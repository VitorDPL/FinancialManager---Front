import { defineStore } from 'pinia'
import axios from 'axios'

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: { labels: [], data: [] }, // dados do gráfico
    monthExpenses: [] // dados da tabela (novo)
  }),

  actions: {
    async getExpensesPerMonth(dates) {
      let url = 'http://127.0.0.1:8000/api/expenses/get-expenses-per-month/'
      
      // se dates foi passado, adiciona como query params
      if (dates && dates.length === 2){
        const [ startDate, endDate ] = dates;
        const params = new URLSearchParams();
        
        console.log("Datas selecionadas: ", dates); 

        if(startDate) params.append('start', startDate.toISOString().split('T')[0])
        if(endDate) params.append('end', endDate.toISOString().split('T')[0])

        url += `?${params.toString()}`
      }

      const { data } = await axios.get(url);
      this.expenses = data; // mantém dados do gráfico
    },

    async addExpense(payload) {
      await axios.post('http://127.0.0.1:8000/api/expenses/create/', payload)
      await this.getExpensesPerMonth()
    },

    async getExpensesUniqueMonth(date) {
      let url = 'http://127.0.0.1:8000/api/expenses/get-expenses-unique-month/'
      
      if (date) {
        const params = new URLSearchParams()
        
        let dateValue = date
        if (date && typeof date === 'object' && date._value !== undefined) {
          dateValue = date._value
        }
        
        if (typeof dateValue === 'string') {
          params.append('month', dateValue)
        } 
        
        url += `?${params.toString()}`
      }

      console.log("URL final:", url)
      
      const { data } = await axios.get(url)
      console.log("Dados recebidos:", data)
      
      // CORREÇÃO: usar novo campo para dados da tabela
      this.monthExpenses = data.expenses || [];
      
      return data
    }
  }
})
