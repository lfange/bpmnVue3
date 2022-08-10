<script setup lang="ts">

// props/emit typed
interface FormState {
  name: String;
  id: String;
  versionTag: String;
  isExecutable: String;
  $type: String;
}

const props = defineProps<{
  formState: FormState,
}>()

const emits = defineEmits<{
  (e: 'change', T: any): void
}>()

function updateKeys(key: any) {
  console.log('updateS', props.formState)
  const updateObj: any = Object.create(null)
  if (key === "id") {
      updateObj.id = props.formState[key]
      updateObj.di = { id: `${props.formState[key]}_di` }
  }
  if (key === "isExpanded") {
    // window?.bpmnInstances?.modeling.toggleCollapse(this.bpmnElement);
    return;
  }
  // update name.etc
  updateObj[key] = props.formState[key];
  emits('change', updateObj)
}
</script>
<!-- <script>
import { ref, toRefs, defineProps, defineComponent } from "vue";

export default defineComponent({});
</script> -->
<template>
  <a-form-item label="名称" name="username">
    <a-input v-model:value="formState.name" @change="updateKeys('name')" />
  </a-form-item>
  <a-form-item label="ID" name="id">
    <a-input v-model:value="formState.id" @change="updateKeys('id')" />
  </a-form-item>
  <a-form-item label="版本标签" name="versionTag" v-if="formState.$type === 'bpmn:Process'">
    <a-input v-model:value="formState.versionTag" @change="updateKeys('versionTag')" />
  </a-form-item>
  <a-form-item label="可执行" name="isExecutable" v-if="formState.$type === 'bpmn:Process'">
    <a-checkbox v-model:checked="formState.isExecutable" @change="updateKeys('isExecutable')"></a-checkbox>
  </a-form-item>
</template>
