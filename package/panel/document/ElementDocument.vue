<script setup lang="ts">
  import { ref, computed, defineEmits } from 'vue';
  
  interface documentObje {
    $type: String
    text: String
  }

  interface FormState {
    documentation?: documentObje[]
  }

  interface Props {
    formState: FormState
  }
  // declare const window: Window & { bpmnInstances: Object }

  // Props assgin defalut Value by Using withDefaults
  const props = defineProps<Props>()
  
  const emits = defineEmits<{
    (e: 'change', T: any): void
  }>()

  const docus = ref<Array<Object>>([])

  function updateDocumentation(index: Number, doc: String) {
    console.log('toRef', doc, '  doc ', )
    const documents = window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: doc });
    const updateObj =  {
      documentation: [ documents ]
    }
    emits('change', updateObj)

    docus.value.forEach(it => {
      console.log('val', it, it.text)
    })
  }

  function getRefs(it) {
    console.log('it', it, docus.value)
  }
</script>

<template>
  <a-form-item label="元素说明" name="documentation" v-for="(docs, index) in formState.documentation" ref="docus">
    <a-textarea v-model:value="docs.text"  @change="updateDocumentation(index, docs.text)" />
  </a-form-item>
</template>