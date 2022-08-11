// Global compile-time constants
declare interface Window {
  bpmnInstances: any
}

declare var bpmnInstances: any
declare var Vue: any

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}