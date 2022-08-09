<script setup lang="ts">
import type { Ref } from "vue";
import { ref, reactive, watch, computed, provide } from "vue";
import headerTitle from "./header";
import { ArrowRightOutlined } from "@ant-design/icons-vue";

import ElementBaseInfo from "./base/ElementBaseInfo.vue";
import ElementDocument from "./document/ElementDocument.vue";
import ElementListeners from "./listeners/ElementListeners.vue";
import translations from "../designer/plugins/translate/translations";

provide('prefix', 'camunda')

const aaa = ref<String>('aaaaaaaaa')

defineExpose({
  name: 'PropertiesPanel',
  aaaaaaaa: aaa
})

const props = defineProps<{
  id: String;
  title: String;
  bpmnModeler: Object;
}>();

// TypeScript Reactive
interface State {
  activeKey: String;
  elementDataObj: any;
  elementId: String;
  SeleEleType: String;
  bpmnElement: Object;
  conditionFormVisible: Boolean;
}
const state: State = reactive({
  activeKey: "1",
  bpmnElement: {},
  elementDataObj: {},
  elementId: "",
  SeleEleType: "",
  conditionFormVisible: false,
});

const formVisible: Ref<Boolean> = ref(false);
// or
const formState = ref<Object>({});
// Refs TypeScript:   Refs infer the type used above by one of two;

const eventType = computed<String>(() => translations[state.SeleEleType])

function onFinishFailed(e: any) {
  console.log("onFinishFailed", e);
}

function onFinish(e: any) {
  console.log("onFinishonFinish", e);
}


watch(() => props.bpmnModeler, () => {
  console.log('watch is called')
  initModels()
})

function initModels(): void {
  window.bpmnInstances = {
    modeler: props.bpmnModeler,
    modeling: props.bpmnModeler.get("modeling"),
    moddle: props.bpmnModeler.get("moddle"),
    eventBus: props.bpmnModeler.get("eventBus"),
    bpmnFactory: props.bpmnModeler.get("bpmnFactory"),
    elementFactory: props.bpmnModeler.get("elementFactory"),
    elementRegistry: props.bpmnModeler.get("elementRegistry"),
    replace: props.bpmnModeler.get("replace"),
    selection: props.bpmnModeler.get("selection"),
  };
  getActiveElement();
}

function getActiveElement() {
  // 初始第一个选中元素 bpmn:Process
  initFormOnChanged(null);
  props.bpmnModeler.on("import.done", () => {
    initFormOnChanged(null);
  });
  // 监听选择事件，修改当前激活的元素以及表单
  props.bpmnModeler.on("selection.changed", ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null);
  });
  props.bpmnModeler.on("element.changed", ({ element }) => {
    // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
    if (element && element.id === state.elementId) {
      initFormOnChanged(element);
    }
  });
}

// 初始化数据
function initFormOnChanged(element: any) {
  let activatedElement = element;
  if (!activatedElement) {
    activatedElement =
      window.bpmnInstances.elementRegistry.find(
        (el: { type: string }) => el.type === "bpmn:Process"
      ) ??
      window.bpmnInstances.elementRegistry.find(
        (el: { type: string }) => el.type === "bpmn:Collaboration"
      );
  }
  if (!activatedElement) return;

  state.SeleEleType = activatedElement.type;

  // Log.printBack(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`);
  // Log.prettyInfo("businessObject", activatedElement.businessObject);
  window.bpmnInstances.bpmnElement = activatedElement;
  state.bpmnElement = activatedElement;
  state.elementId = activatedElement.id;
  state.SeleEleType = activatedElement.type.split(":")[1] || "";
  state.elementDataObj = JSON.parse(
    JSON.stringify(activatedElement.businessObject)
  );
  state.conditionFormVisible = !!(
    state.SeleEleType === "SequenceFlow" &&
    activatedElement.source &&
    activatedElement.source.type.indexOf("StartEvent") === -1
  );
  formVisible.value = state.SeleEleType === "UserTask" || state.SeleEleType === "StartEvent";
}

// update Window.bpmnInstances when properties changed!
function updateProperties(updateObj: any) {
  const bpmnElement = window.bpmnInstances.bpmnElement || {};
  window.bpmnInstances.modeling.updateProperties(bpmnElement, updateObj);
}

</script>
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "PropertiesPanel",
    // props: {
    //   title: String,
    //   bpmnModel: Object,
    // },
    // setup(props, context) {
    //   const { title } = toRefs(props)
    //   console.log("toRefs", title);
    //   console.log("title", props, props.bpmnModel);
    //   console.log('context', context.attrs);
    //   const Counter = ref("countersssssssssssssss");
    //   return {
    //     title,
    //     Counter,
    //   };
    // }
  });
</script>

<template>
  <div>
    <headerTitle level="3">
      {{ eventType }} <icon-font type="icon-tuichu" /> <ArrowRightOutlined /> {{ state.elementDataObj.name }}
    </headerTitle>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-collapse
        v-model:activeKey="state.activeKey"
        :showArrow="false"
        :expand-icon-position="'right'"
      >
        <a-collapse-panel key="general" header="常规">
          <ElementBaseInfo :formState="state.elementDataObj" @change="updateProperties"/>
        </a-collapse-panel>
        <a-collapse-panel key="document" header="文档">
          <ElementDocument :formState="state.elementDataObj" @change="updateProperties" />
        </a-collapse-panel>
        <a-collapse-panel key="extensionElements" header="执行监听器">
          <ElementListeners :formState="state.elementDataObj" @change="updateProperties" />
        </a-collapse-panel>
        <a-collapse-panel key="3" header="This is panel header 3">
          <p>{{ eventType }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
  </div>
</template>
<style lang="scss" scoped>


</style>
