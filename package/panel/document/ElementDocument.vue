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

  // update bpmnInstances When properties modifed!
  function updateDocumentation(index: Number, doc: String) {
    const documents: Array<Object> = []

    // update each children of documentations because of is Array
    props.formState.documentation?.forEach((el: documentObje, ind: Number) => {
      if (index === ind) {
        documents.push(window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: doc }))
      } else {
        documents.push(documents.push(window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: el.text })))
      }
    })

    const updateObj =  {
      documentation: documents
    }
    emits('change', updateObj)
  }

</script>

<template>
  <a-form-item label="元素说明" name="documentation" v-for="(docs, index) in formState.documentation" >
    <a-textarea v-model:value="docs.text"  @change="updateDocumentation(index, docs.text)" />
  </a-form-item>
</template>