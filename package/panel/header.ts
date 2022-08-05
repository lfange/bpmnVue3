import { h, ref, toRefs } from 'vue';

interface Context {
  attrs: Object
  slots: Object
}

const style =  {
  width: '100%',
  padding: '8px 16px',
  background: '#F1F2F4'
}


const headerTitle = (props: Object, context: Context) => {

  const title = ref<String>('titletitletitle')
  // console.log('headerTitle', props, `h${props.level}`)
  // console.log('context', context)
  return h(`h${props.level}`, { style, ...context.attrs  }, context.slots)
}

export default headerTitle
