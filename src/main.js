import {
  createApp
} from 'vue'


import Antd from 'ant-design-vue';
import App from './App.vue'

import 'ant-design-vue/dist/antd.css';


import ProcessDesigner from '../package/index.js'


const app = createApp(App)
// console.log('app', app)
// console.log('design', ProcessDesigner)

ProcessDesigner.install(app)

app.use(Antd)

app.mount('#app')