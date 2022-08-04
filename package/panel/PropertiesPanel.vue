<script setup lang="ts">
  import headerTitle from "./header";
  import { createFromIconfontCN } from '@ant-design/icons-vue';
  import { ArrowRightOutlined } from "@ant-design/icons-vue";

  import ElementBaseInfo from "./base/ElementBaseInfo.vue";

  import ElementDocument from "./document/ElementDocument.vue";

  const props = defineProps<{
    id: String,
    title: String,
    bpmnModeler: Object,
  }>()

  let SeleEleType = ref<String>('');
  let elementDataObj = ref<Object>({});
  const Counter = ref("CounterCounter");
  const formState = ref<Object>({});
  let activeKey = ref('1')
  
  function onFinishFailed(e: any) {  
    console.log('onFinishFailed', e);
  }

  function onFinish(e: any) {
    console.log('onFinishonFinish', e);
  }

  // console.log('defineProps', title)

  console.log('== this', props)
  function onFinished() {
    console.log('onFinished this', props.bpmnModeler.get("moddle"))
    console.log('onFinished', props.bpmnModeler.value)
  }

  onMounted(() => {

  })
  

</script>
<script lang="ts">
import { ref, toRefs, defineProps, defineComponent, onMounted } from "vue";

// declare const elementRegistry: Object;
// declare let bpmnInstances: Object & { elementRegistry: Object };
// declare const window: Window & { bpmnInstances: Object };

declare interface Window {
  bpmnInstances?: Object & { elementRegistry?: Object }
}

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
  created() {
    // this.initModels()
  },
  methods: {
    initModels() {

      console.log('initModels', this.bpmnModeler)
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get("modeling"),
        moddle: this.bpmnModeler.get("moddle"),
        eventBus: this.bpmnModeler.get("eventBus"),
        bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
        elementFactory: this.bpmnModeler.get("elementFactory"),
        elementRegistry: this.bpmnModeler.get("elementRegistry"),
        replace: this.bpmnModeler.get("replace"),
        selection: this.bpmnModeler.get("selection")
      };
      this.getActiveElement();
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null);
      this.bpmnModeler.on("import.done", e => {
        this.initFormOnChanged(null);
      });
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        console.log('selection', newSelection)
        this.initFormOnChanged(newSelection[0] || null);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element);
        }
      });
    },
    // 初始化数据
    initFormOnChanged(element: Object) {
      let activatedElement = element;
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
      }
      if (!activatedElement) return;

      this.SeleEleType = activatedElement.type;

      console.log('SeleEleType', this.SeleEleType)
      // Log.printBack(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`);
      // Log.prettyInfo("businessObject", activatedElement.businessObject);
      window.bpmnInstances.bpmnElement = activatedElement;
      this.bpmnElement = activatedElement;
      this.elementId = activatedElement.id;
      this.SeleEleType = activatedElement.type.split(":")[1] || "";
      this.elementDataObj = JSON.parse(JSON.stringify(activatedElement.businessObject));
      this.conditionFormVisible = !!(
        this.SeleEleType === "SequenceFlow" &&
        activatedElement.source &&
        activatedElement.source.type.indexOf("StartEvent") === -1
      );
      this.formVisible = this.SeleEleType === "UserTask" || this.SeleEleType === "StartEvent";
    },
    onFinished1() {
      console.log('onFinished1', this, this.bpmnModeler)
      this.initModels()
    }
  }
});
</script>

<template>
  <div>
    <button @click="onFinished">button</button>
    <button @click="onFinished1">button1</button>
    <headerTitle :innerHTML="'ArrowRightOutlined'"  level="3">
      {{ SeleEleType }}
      <icon-font type="icon-tuichu" /> <ArrowRightOutlined /> {{ title }}
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
        <a-collapse v-model:activeKey="activeKey" :showArrow="false" :expand-icon-position="'right'">
            <a-collapse-panel key="general" header="常规">
              <ElementBaseInfo :formState="elementDataObj" />
            </a-collapse-panel  >
            <a-collapse-panel key="document" header="文档" >
              <ElementDocument :formState="elementDataObj"  />
            </a-collapse-panel>
            <a-collapse-panel key="1" :header="title" :showArrow="false" >

                <p>{{ Counter }}</p>
            </a-collapse-panel>

            <a-collapse-panel key="3" header="This is panel header 3">
              <p>{{ Counter }}</p>
            </a-collapse-panel>
        </a-collapse>
      </a-form>
  </div>
</template>
<style lang="scss" scoped>


</style>
