<script >
// import { ref } from 'vue'
// 引入相关的依赖
import Modeler from 'bpmn-js/lib/Modeler'
defineProps({
  msg: String
})

export default {

  data () {
    return {
      bpmnModeler: null
    }
  },

  mounted () {

  },
  methods: {
    int () {
      this.bpmnModeler = new Modeler({
        container: '#canvas'
      })
      this.createNewDiagram()
    }
  }
}

</script>

<template>
  <div class="">
    <div id="canvas"></div>

  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
