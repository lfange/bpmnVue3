<script setup lang="ts">
import { fieldType } from '@/panel/listeners/utils';
// import { initListenerType, listenerType, fieldType, initListenerForm } from '@/panel/listeners/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, InteractionOutlined } from '@ant-design/icons-vue';
const columns: Object[] = [
  { dataIndex: 'event', key: 'event', title: '事件' },
  { dataIndex: 'type', key: '$type', title: '监听器类型' },
  { dataIndex: 'expreValue', key: 'expreValue', title: '表达式' },
  { dataIndex: 'operation', key: 'operation', title: '操作' },
]
const emit = defineEmits<{
  (e: 'change', T: any): void
}>()

const openListenerForm = (): void => {
  emit('change', 'emit')
}

const editRecord = (record: any, index: number): void => {

}

</script>
<script lang="ts">

import { defineComponent, reactive } from 'vue';
export default defineComponent({
  props: {
    formState: Object,
  },
  setup(props: any, context: any) {
    console.log('propsprops', props)

    const state: any = reactive({
      listenerForm: []
    })

    const removeAttributes = (reord: any, index?: number): void => {
      console.log('removeAttributes', props)
    }

    return {
      removeAttributes,
      openListenerForm,
      ...state
    }
  }
})

</script>
<template>
  <a-table size="small" :pagination="false" bordered :data-source="listenerForm?.fields || []" :columns="columns">
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.dataIndex === 'type'">
        {{ fieldType[record.type] }}
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="link" @click="editRecord(record, index)">
          <edit-outlined />
        </a-button>
        <a-popconfirm title="Sure to delete?" @confirm="removeAttributes(record, index)">
          <a>
            <delete-outlined />
          </a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-button type="primary" size="small" block @click="openListenerForm">
    <plus-outlined />添加监听器
  </a-button>
</template>

<style lang="scss" scoped>
</style>