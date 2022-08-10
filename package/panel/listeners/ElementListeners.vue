<script setup lang="ts">
import { ref, reactive, computed, inject } from 'vue';
import { initListenerType, createListenerObject } from '../utils/utils';

const prefix = inject<string>('prefix')

interface FormState {
  extensionElements: any
}

const props = defineProps<{
  formState: FormState
}>();

interface State {
  dataSource: Array<Object>
}

const columns: Array<Object> = [
  { dataIndex: 'event', key: 'event', title: '事件' },
  { dataIndex: 'type', key: '$type', title: '监听器类型' },
  { dataIndex: 'index', key: 'expression', title: '表达式' },
  { dataIndex: 'operation', key: 'operation', title: '操作' },
]

// filter tableData from extensionElements
const dataSource = computed(
  () =>
    (props.formState.extensionElements.values.filter((ele: any) => ele.$type === `${prefix}:ExecutionListener`)).map((listener: any) => initListenerType(listener))
    || [])

function getR() {
}

</script>
<template>
  <a-table size="small" :pagination="false" bordered :data-source="dataSource" :columns="columns">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'operation'">
        编辑
        <a-popconfirm title="Sure to delete?" @confirm="onDelete(record.key)">
          <a>Delete</a>
        </a-popconfirm>
      </template>
      <template v-if="column.dataIndex === 'type'">
        {{ createListenerObject(record.listenerType, false, prefix) }}
      </template>
    </template>
  </a-table>
</template>

<style lang="scss" scoped>
</style>