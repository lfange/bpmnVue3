import {
  createApp
} from 'vue'


import Antd from 'ant-design-vue';
import App from './App.vue'

import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

import "../package/highlight";

import ProcessDesigner from '../package/index'

ProcessDesigner.install(app)
// Object.keys(ProcessDesigner).forEach(compent => {
//   // compent.install(app)
//   console.log('compent', compent);
// })

// console.log('app', app)
// console.log('design', ProcessDesigner)

// ProcessDesigner.install(app)

app.use(Antd)

app.mount('#app')