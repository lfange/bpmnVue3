<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
export default {
  data() {
    return {
      bpmnModel: null,
      element: null
    };
  },
  methods: {
    initFinish(modeler) {
      this.bpmnModel = modeler;
    },

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
<!-- <script setup>
  import { ref } from "vue";
  const bpmnModel = ref(null);

  function initFinish(modeler) {
    bpmnModel = modeler;
    console.log("bpmnModel", bpmnModel);
  }
</script> -->

<template>
  <ProcessDesigner
    @element-click="elementClick"
    @element-contextmenu="elementContextmenu"
    @initFinished="initFinish" />
  <PropertiesPanel :title="'标题'" id="dsr251sd" :bpmnModel="bpmnModel" />
</template>

<style>
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
</style>
