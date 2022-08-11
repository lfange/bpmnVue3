<script setup lang="ts">
import { ref, watch, inject, reactive, computed } from 'vue';
import { initListenerType, listenerType, fieldType, initListenerForm } from './utils';
import { createListenerObject, updateElementExtensions } from '../utils/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, InteractionOutlined } from '@ant-design/icons-vue';
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

const bpmnElement = ref<any>(window.bpmnInstances.bpmnElement)

watch(props.formState.extensionElements, () => {
  // extensionElements set id
  extensionsList.value = props.formState.extensionElements?.values ?? []
  extensionsList.value.forEach((el: any, ind: number) => { el.index = ind });
  eleListenerList.value = extensionsList.value.filter((ele: any) => ele.$type === `${prefix}:ExecutionListener`).map((listener: Object) => initListenerType(listener))
}, {
  immediate: true
})

// remove the seleted Listener
function removeListener(listener?: any, index?: Number) {
  const bpmnIndx = props.formState.extensionElements?.values.findIndex((el: any) => el.index == listener.index)
  extensionsList.value.splice(bpmnIndx, 1)
  eleListenerList.value.splice(index, 1);
  const updateA: any[] = []
  extensionsList.value.forEach((el: any) => {
    updateA.push(createListenerObject(el, false, `${prefix}`))
  })
  console.log('updateA', updateA)
  updateElementExtensions(updateA);
}

// about drawer configuration
interface DrawerState {
  visible: Boolean,
  editListenerIndex: number,
  listenerForm: any
}
const draweState: DrawerState = reactive({
  visible: false,
  editListenerIndex: -1,
  listenerForm: {}
})
// dataSource about event Select
const eventOpt = ref<SelectProps['options']>([
  { value: 'start', label: '开始', },
  { value: 'end', label: '结束', },
]);

// open the sidebar that elementListenerForm detail 
function openListenerForm(listener?: any, index?: number = -1) {
  draweState.listenerForm = listener ? initListenerForm(listener) : {}
  draweState.editListenerIndex = index
  if (listener && listener.fields) {
    draweState.listenerForm.fields.map((field: any) => {
      field.type = field.string ? "string" : "expression"
      field.expre = field.string || field.expression
    });
  } else {
    draweState.listenerForm.fields = []
  }
  draweState.visible = true
}

interface Ele {
  key: string,
  label: string
}

function typeListener(): Ele {
  const ele: Ele = {};
  enum list {
    class = "Java 表达式",
    expression = "表达式",
    delegateExpression = "代理表达式"
  }
  Object.keys(draweState.listenerForm).forEach((el: string) => {
    if (list[el]) {
      ele.key = el
      ele.label = list[el]
    }
  });
  return ele
}

// delete seleted listeners
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

// save listener configuration
const saveListenerConfig = () => {
  const listenerObject = createListenerObject(draweState.listenerForm, false, `${prefix}`);
  if (draweState.editListenerIndex === -1) {
    extensionsList.value.push(listenerObject);
    eleListenerList.value.push(draweState.listenerForm);
  } else {
    extensionsList.value.splice(draweState.editListenerIndex, 1, listenerObject);
    eleListenerList.value.splice(draweState.editListenerIndex, 1, draweState.listenerForm);
  }
  // 保存其他配置
  updateElementExtensions(bpmnElement, extensionsList.value);
  // 4. 隐藏侧边栏
  // draweState.visible = false;
  // draweState.listenerForm = {};
}

// fields in drawer 
const fiedsState = reactive({
  columns: [
    { dataIndex: 'name', key: 'name', title: '字段名称' },
    { dataIndex: 'type', key: 'type', title: '字段类型' },
    { dataIndex: 'expre', key: 'expre', title: '表达式' },
    { dataIndex: 'operation', key: 'operation', title: '操作' },
  ]
})

// injected configuration modal switch
const modalVisible = ref<Boolean>(false)
const FiledForm = ref<any>({})  // Filed Injection config Form
const FiledIndex = ref<number>(-1)
// open Filed Injection Modal 
function openFiledForm(filed: any, index: number) {
  FiledForm.value = filed ?? JSON.parse(JSON.stringify(filed))
  FiledIndex.value = index ?? -1
}

function editRecord(record: Object, index: Number) {
  console.log('index', record, index)
  draweState.listenerForm = JSON.parse(JSON.stringify(record))
}

function handleOk() { }

</script>

<template>
  <a-table size="small" :pagination="false" bordered :data-source="eleListenerList" :columns="columns">
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="link" @click="openListenerForm(record, index)">
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
  <a-button type="primary" size="small" block @click="openListenerForm">
    <plus-outlined />添加监听器
  </a-button>

  <a-drawer title="执行监听器" placement="right" :closable="false" :visible="draweState.visible"
    @close="draweState.visible = false">
    <a-form :model="draweState.listenerForm" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
      autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="事件类型" name="event" :rules="[{ required: true, message: 'Please input select event!' }]">
        <a-select ref="select" v-model:value="draweState.listenerForm.event" :options="eventOpt">
        </a-select>
      </a-form-item>
      <a-form-item label="监听器类型" name="listenerType"
        :rules="[{ required: true, message: 'Please input your listenerType!' }]">
        <a-select ref="select" v-model:value="draweState.listenerForm.listenerType">
          <a-select-option :value="key" v-for="key in Object.keys(listenerType)">{{ listenerType[key] }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="class" :name="'class'" :rules="[{ required: true }]">
        <a-input v-model:value="draweState.listenerForm.class" placeholder="Basic usage" />
      </a-form-item>
      <!-- <a-form-item :label="typeListener().label" :name="typeListener().key" :rules="[{ required: true }]">
        <a-input v-model:value="draweState.listenerForm[typeListener().key]" placeholder="Basic usage" />
      </a-form-item> -->
      <!-- <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item> -->
    </a-form>
    <div class="drawer-secon-header">
      <div>
        <interaction-outlined /> 注入字段
      </div>
      <a-button size="small" type="primary" @click="openFiledForm">添加字段</a-button>
    </div>
    <a-table size="small" :pagination="false" bordered :data-source="draweState.listenerForm?.fields || []"
      :columns="fiedsState.columns">
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.dataIndex === 'type'">
          {{ fieldType[record.type] }}
        </template>
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
      </template>
    </a-table>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="saveListenerConfig">Create</a-button>
      <a-button style="margin-left: 10px">Cancel</a-button>
    </a-form-item>
  </a-drawer>

  <a-modal v-model:visible="modalVisible" title="注入字段添加" @ok="handleOk">
    <a-form :model="draweState.listenerForm" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
      autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="字段名称" name="event" :rules="[{ required: true, message: 'Please input select event!' }]">
        <a-select ref="select" v-model:value="draweState.listenerForm.event" :options="eventOpt">
        </a-select>
      </a-form-item>
      <a-form-item label="字段类型" name="listenerType"
        :rules="[{ required: true, message: 'Please input your listenerType!' }]">
        <a-select ref="select" v-model:value="draweState.listenerForm.listenerType">
          <a-select-option :value="key" v-for="key in Object.keys(fieldType)">{{ fieldType[key] }}</a-select-option>
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