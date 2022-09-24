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

    const title = ref<String>('titletitletitle')
    
    const style =  {
      width: '100%',
      padding: '8px 16px',
      background: '#F1F2F4'
    }
    console.log('context', context.slots)

    return () => h(`h${props.level}`, { style, ...context.attrs  }, context.slots)
  }

})

export default HeaderTitle
