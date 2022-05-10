<script >
import { ref } from 'vue'
// 引入相关的依赖
import Modeler from 'bpmn-js/lib/Modeler'

import Diagram from './newDiagram'

import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'



import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';

// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

import 'bpmn-js-properties-panel/dist/assets/properties-panel.css' // 右边工具栏样式
import 'bpmn-js-properties-panel/dist/assets/element-templates.css' // 右边工具栏样式

export default {
  data () {
    return {
      bpmnModeler: null
    }
  },
  mounted () {
    this.int()
  },
  methods: {
    int () {
      this.bpmnModeler = new Modeler({
        container: '#canvas',
        propertiesPanel: {
          parent: '#properties'
          // parent: '#js-properties-panel'
        },
        additionalModules: [
          // 右边的属性栏
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          CamundaPlatformPropertiesProviderModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      console.log('bpmn', this.bpmnModeler)
      this.createNewDiagram()
    },

    async createNewDiagram () {
      try {
        await this.bpmnModeler.importXML(Diagram)

        console.log('canvas', this.$refs.canvas)
        // ...
      } catch (err) {
        // err...
      }
    }
  }
}

</script>

<template>
  <div class="modeler">
    <div id="canvas" class="canvas" ref="canvas"></div>
    <div id="properties"></div>
  </div>
</template>

<style scoped>
.modeler {
  width: 100%;
  height: 100%;
  position: relative;
}
.canvas,
.modeler {
  width: 100%;
  height: 100%;
}

#properties {
  position: absolute;
  top: 20px;
  right: 16px;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>
