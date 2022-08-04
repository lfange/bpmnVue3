<script setup lang="ts">
  import { ref } from 'vue';
  
  interface documentObje {
    $type: String
    text: String
  }

  interface FormState {
    documentation?: documentObje[]
  }
  // declare const window: Window & { bpmnInstances: Object }

  const props = withDefaults(defineProps<FormState>(), {
    documentation: () => [{ $type: '$type', text: 'documentation  text' }]
  })
  

  let documentation = ref<string>(props.documentation[0].text)

  function updateDocumentation() {
    console.log('toRef', props.documentation)
    const documentation = window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: this.documentation });
    window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
      documentation: [documentation]
    });
  }
</script>

<template>
  <a-form-item label="元素说明" name="documentation">
    <a-textarea v-model:value="documentation"  @change="updateDocumentation"/>
  </a-form-item>
</template>