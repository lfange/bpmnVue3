<script setup lang="ts">
    defineProps({
        formState: Object<String | any>
    })
</script>
<!-- <script>
import { ref, toRefs, defineProps, defineComponent } from "vue";

export default defineComponent({});
</script> -->
<template>
    <a-form-item label="名称" name="username">
      <a-input v-model:value="formState.username" />
    </a-form-item>
    <a-form-item label="ID" name="ID">
      <a-input v-model:value="formState.ID" />
    </a-form-item>
    <a-form-item label="版本标签" name="Tag">
      <a-input v-model:value="formState.Tag" />
    </a-form-item>
    <a-form-item label="可执行" name="execute">
      <a-input v-model:value="formState.execute" />
    </a-form-item>
</template>
