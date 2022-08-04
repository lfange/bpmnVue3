<script setup lang="ts">

    // 类型的 props/emit 声明
    interface FormState {
      name: String;
      id: String;
      tag: String;
      isExecutable: String;
      $type: String;
    }

    const props = defineProps<{ formState: FormState }>()

    function updateS(e: any) {
      console.log('updateS', props.formState)
      console.log('updateS', e)
    }
</script>
<!-- <script>
import { ref, toRefs, defineProps, defineComponent } from "vue";

export default defineComponent({});
</script> -->
<template>
    <a-form-item label="名称" name="username">
      <a-input v-model:value="formState.name"  @change="updateS"/>
    </a-form-item>
    <a-form-item label="ID" name="id">
      <a-input v-model:value="formState.id" />
    </a-form-item>
    <a-form-item label="版本标签" name="tag" v-if="formState.$type === 'bpmn:Process'">
      <a-input v-model:value="formState.tag" />
    </a-form-item>
    <a-form-item label="可执行" name="isExecutable" v-if="formState.$type === 'bpmn:Process'">
      <a-checkbox v-model:checked="formState.isExecutable"></a-checkbox>
    </a-form-item>
</template>
