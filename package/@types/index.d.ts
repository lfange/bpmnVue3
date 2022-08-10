
// Global compile-time constants

declare var bpmnInstances: any
declare var Vue: any

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}