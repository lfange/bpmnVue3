import { h, ref, toRefs, defineComponent } from 'vue';

interface Context {
  attrs: Object
  slots: Object
}

const HeaderTitle = defineComponent({
  props: {
    level: Number
  },
  setup(props, context) { 
    const style =  {
      width: '100%',
      padding: '8px 16px',
      background: '#F1F2F4'
    }
    return () => h(`h${props.level}`, { style, ...context.attrs  }, context.slots)
  }
})

export default HeaderTitle
