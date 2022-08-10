import ProcessDesigner from './designer'
import MyPropertiesPanel from './panel';
import './styles/index.scss'
const components = [ ProcessDesigner, MyPropertiesPanel ]

const install = function (Vue: any) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "0.0.1",
  install,
  ...components
};