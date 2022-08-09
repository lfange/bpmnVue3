import PropertiesPanel from './PropertiesPanel.vue'

console.log('PropertiesPanel', PropertiesPanel.name)
console.log('PropertiesPanel', PropertiesPanel)

PropertiesPanel.install = function (Vue) {
  Vue.component(PropertiesPanel.name, PropertiesPanel)
}

export default PropertiesPanel