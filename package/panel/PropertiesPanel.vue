<script setup lang="ts">
  import ElementBaseInfo from "./base/ElementBaseInfo.vue";

  defineProps({
    id: String,
    title: String,
    bpmnModel: Object,
  })

  const Counter = ref("CounterCounter");
  const formState = ref({});
  let activeKey = ref('1')
  
  function onFinishFailed(e: any) {  
    console.log('onFinishFailed', e);
  }

  function onFinish(e: any) {
    console.log('onFinish', e);
  }

</script>
<script lang="ts">
import { ref, toRefs, defineProps, defineComponent } from "vue";

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
    <h3> {{ title }} </h3>
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
              <ElementBaseInfo :formState="formState" />
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
