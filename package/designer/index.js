import Designer from './Designer.vue'

Designer.install = function (Vue) {
  Vue.component(Designer.name, Designer)
}

export default Designer