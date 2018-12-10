import Vue from 'vue'
import App from './index'
import store from '@/store'
console.log({...App,store})

const app = new Vue({...App,store})
app.$mount()
