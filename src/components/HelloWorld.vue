<script >
import { ref } from 'vue'

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

      const atr = `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
        xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
        id="sample-diagram"
        targetNamespace="http://bpmn.io/schema/bpmn"
        xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="192" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`

      console.log('Diagram', Diagram)
      try {
        await this.bpmnModeler.importXML(atr)

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
