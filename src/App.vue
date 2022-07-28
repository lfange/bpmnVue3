<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Test from './test.vue'

export default {
  data() {
    return {
      bpmnModel: null,
      element: null
    };
  },
  methods: {
    // initFinish(modeler) {
    //   this.bpmnModel = modeler;
    // },

    elementClick(element) {
      console.log(element);
      this.element = element;
    },
    elementContextmenu(element) {
      console.log("elementContextmenu:", element);
    },
  },
};
</script>
<script setup>
  import { ref } from "vue";
  // let bpmnModel = ref('null');
  const title = ref('付款流程')

  const ids = ref('dsr251sd')

  function initFinish(modeler) {
    // bpmnModel = modeler;
    const bpmnModel = ref(modeler);
    console.log("bpmnModelbpmnModel", modeler);
    console.log("bpmnModel", bpmnModel);
  }

  // function initFinish(prps) {
  //   bpmnModel = prps
  // }
</script>

<template>
  {{ typeof bpmnModel }}
  <div class="container">
    <Test :bpmnModel="bpmnModel" title="'title'" />
    <ProcessDesigner
      @element-click="elementClick"
      @element-contextmenu="elementContextmenu"
      @initFinished="initFinish" />
    <PropertiesPanel :title="title" :id="ids" class="proerties-panel" :bpmnModel="bpmnModel" />
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
      top: 20%;
      right: 3%;
    }
  }
</style>
