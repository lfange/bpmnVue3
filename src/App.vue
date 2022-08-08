<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
  import Test from './test.vue'
  import { ref, onMounted } from 'vue';

  const bpmnModeler = ref<Object>({});

  const title = ref<String>('付款流程')

  const btn = ref<any>({})

  const ids = ref('dsr251sd')

  function initFinish(modeler: Object) {
    // bpmnModeler = modeler;
    bpmnModeler.value = modeler;
    console.log("initFinish bpmnModeler", bpmnModeler);
  }

  function elementClick(element: Object) {
      // this.element = element;
      console.log(btn.value, btn.value.aaaaaaaa)
  }

  function elementContextmenu(element: Object) {
      console.log("elementContextmenu:", element);
  }

  onMounted (() => {
    
  })
  
</script>

<template>
  <!-- <button @click="title = '++'" :ref="btn"> {{ title }}</button> -->
  <div class="container">
    <!-- <Test :bpmnModeler="bpmnModeler" title="'title'" /> -->
    <ProcessDesigner
      @element-click="elementClick"
      @element-contextmenu="elementContextmenu"
      @initFinished="initFinish" />
    <PropertiesPanel :title="title" :id="ids" class="proerties-panel" :bpmnModeler="bpmnModeler" ref="btn" />
  </div>
</template>

  <style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100vh;
  }
  
  .container {
    width: 100%;
    height: 100%;
    position: relative;

    .proerties-panel {
      width: 380px;
      position: absolute;
      top: 3%;
      right: 2%;
    }
  }
</style>
