<script setup lang="ts">
import { ref, watch, inject } from 'vue';
import { initListenerType, listenerType, fieldType } from './utils'
import { createListenerObject, updateElementExtensions } from '../utils/utils';
import { EditOutlined, DeleteOutlined, InteractionOutlined } from '@ant-design/icons-vue';
import type { SelectProps } from 'ant-design-vue';

const prefix = inject<string>('prefix')

const props = defineProps<{
  formState: {
    extensionElements: any
  }
}>();

const columns: Array<Object> = [
  { dataIndex: 'event', key: 'event', title: '事件' },
  { dataIndex: 'type', key: '$type', title: '监听器类型' },
  { dataIndex: 'expreValue', key: 'expreValue', title: '表达式' },
  { dataIndex: 'operation', key: 'operation', title: '操作' },
]

// filter tableData from extensionElements
const extensionsList = ref<Array<any>>([])  // dataSource
const eleListenerList = ref<object[]>([])
const otherExtensionList = ref<object[]>([])

const bpmnElement = ref<Object>(window.bpmnInstances.bpmnElement)

watch(props.formState.extensionElements, () => {
  // extensionElements set id
  extensionsList.value = props.formState.extensionElements?.values ?? []

  extensionsList.value.forEach((el: any, ind: number) => {
    el.index = ind
  });
  
  eleListenerList.value = extensionsList.value.filter((ele: any) => ele.$type === `${prefix}:ExecutionListener`).map((listener: Object) => initListenerType(listener))
}, {
  immediate: true
})


// remove the seleted Listener
function removeListener(listener?:any, index?:Number) {
    const bpmnIndx = props.formState.extensionElements?.values.findIndex((el: any) => el.index == listener.index)
    extensionsList.value.splice(bpmnIndx, 1)
    eleListenerList.value.splice(index, 1);
    console.log('extensionsList.value)', JSON.parse(JSON.stringify(extensionsList.value)))
    console.log('LLLLLLbpmnIndxbpmnIndx', Array.prototype.slice.call(extensionsList.value))
    const arr: any[] = JSON.parse(JSON.stringify(extensionsList.value))

    arr.forEach(it => {
      it.__proto__ =  window.bpmnInstances.bpmnElement.__proto__
    })

    updateElementExtensions(extensionsList.value, bpmnElement.value);
}

// about drawer configuration
const visible = ref<boolean>(false);
const ItemForm = ref<any>({})
// dataSource about event Select
const eventOpt = ref<SelectProps['options']>([
  { value: 'start', label: '开始', },
  { value: 'end', label: '结束', },
]);

function editRecord(record: Object, index: Number) {
  console.log('index', record, index)
  visible.value = true;
  ItemForm.value = JSON.parse(JSON.stringify(record))
}

// delete seleted listeners
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

// injected configuration modal switch
const modalVisible = ref<Boolean>(false)
const FiledForm = ref<any>({})  // Filed Injection config Form
const FiledIndex = ref<number>(-1)
// open Filed Injection Modal 
function openFiledForm(filed: any, index: Number) {
  FiledForm.value = filed ?? JSON.parse(JSON.stringify(filed))
  FiledIndex.value = index ?? -1
}

</script>

<template>
  <a-table size="small" :pagination="false" bordered :data-source="eleListenerList" :columns="columns">
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="link" @click="editRecord(record, index)">
          <edit-outlined />
        </a-button>
        <a-popconfirm title="Sure to delete?" @confirm="removeListener(record, index)">
          <a>
            <delete-outlined />
          </a>
        </a-popconfirm>
      </template>
      <template v-if="column.dataIndex === 'type'">
        {{ listenerType[record.listenerType] }}
      </template>
    </template>
  </a-table>

  <a-drawer title="执行监听器" placement="right" :closable="false" :visible="visible" @close="visible = false">
    <a-form :model="ItemForm" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
      @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="事件类型" name="event" :rules="[{ required: true, message: 'Please input select event!' }]">
        <a-select ref="select" v-model:value="ItemForm.event" :options="eventOpt">
        </a-select>
      </a-form-item>
      <a-form-item label="监听器类型" name="listenerType" :rules="[{ required: true, message: 'Please input your listenerType!' }]">
        <a-select ref="select" v-model:value="ItemForm.listenerType">
          <a-select-option :value="key" v-for="key in Object.keys(listenerType)">{{listenerType[key]}}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item> -->
    </a-form>
    <div class="drawer-secon-header">
      <div><interaction-outlined /> 注入字段</div>
       <a-button type="primary" @click="openFiledForm">添加字段</a-button>
    </div>
  </a-drawer>

  <a-modal v-model:visible="modalVisible" title="注入字段添加" @ok="handleOk">
     <a-form :model="ItemForm" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
      @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="字段名称" name="event" :rules="[{ required: true, message: 'Please input select event!' }]">
        <a-select ref="select" v-model:value="ItemForm.event" :options="eventOpt">
        </a-select>
      </a-form-item>
      <a-form-item label="字段类型" name="listenerType" :rules="[{ required: true, message: 'Please input your listenerType!' }]">
        <a-select ref="select" v-model:value="ItemForm.listenerType">
          <a-select-option :value="key" v-for="key in Object.keys(fieldType)">{{fieldType[key]}}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
  .drawer-secon-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
  }
</style>