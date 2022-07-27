<script>
import { ref, defineProps } from "vue";

defineProps({
  title: String,
  bpmnModel: Object,
})

export default {
  name: "PropertiesPanel",
  props: {
    bpmnModel: Object
  },
  setup(props, context) {
    console.log("propsprops", props.bpmnModel);
    console.log("context", context);

    const Counter = ref("counter");
    context.expose('22222')
    return {
      Counter,
    };
  },
  mounted() {
    console.log('bpmnModel', this.bpmnModel);
    console.log('title', this.title);
  },
};
// console.log('script', Counter);
</script>

<template>
  name: {{title}},
  <div>
    {{ Counter }}
  </div>
  divdivdivdivdivdivdivdivdivdivdivdivdivdivdiv
</template>
