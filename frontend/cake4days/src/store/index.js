import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    products:[],
  },
  getters: {
  },
  mutations: {
    setFetchProducts(state,products){
      state.products = products
    }
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const res = await axios.get('http://localhost:9090/products')
        commit('setFetchProducts', res.data.data)
      } catch (error) {
        return error
      }
    },
  },
  modules: {
  }
})
