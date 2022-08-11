// 创建监听器实例
export function createListenerObject(options: any, isTask: Boolean, prefix: string):any {
  const listenerObj = Object.create(null);
  listenerObj.event = options.event;
  isTask && (listenerObj.id = options.id); // 任务监听器特有的 id 字段
  switch (options.listenerType) {
    case "script":
      listenerObj.script = createScriptObject(options, prefix);
      break;
    case "expression":
      listenerObj.expression = options.expression;
      break;
    case "delegateExpression":
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    case "class":
      listenerObj.class = options.class;
      break;
  }
  // 注入字段
  if (options.fields) {
    listenerObj.fields = options.fields.map((field: Object) => {
      return createFieldObject(field, prefix);
    });
  }
  // 任务监听器的 定时器 设置
  if (isTask && options.event === "timeout" && !!options.eventDefinitionType) {
    const timeDefinition = bpmnInstances.moddle.create("bpmn:FormalExpression", {
      body: options.eventTimeDefinitions
    });
    const TimerEventDefinition = ModdleCreate("bpmn:TimerEventDefinition", {
      id: `TimerEventDefinition_${uuid(8)}`,
      [`time${options.eventDefinitionType.replace(/^\S/, s => s.toUpperCase())}`]: timeDefinition
    });
    listenerObj.eventDefinitions = [TimerEventDefinition];
  }
  return ModdleCreate(`${prefix}:${isTask ? "TaskListener" : "ExecutionListener"}`, listenerObj);
}

// 创建 监听器的注入字段 实例
export function createFieldObject(option, prefix) {
  const { name, fieldType, string, expression } = option;
  const fieldConfig = fieldType === "string" ? { name, string } : { name, expression };
  return ModdleCreate(`${prefix}:Field`, fieldConfig);
}

// 创建脚本实例
export function createScriptObject(options: any, prefix: string) {
  const { scriptType, scriptFormat, value, resource } = options;
  const scriptConfig = scriptType === "inlineScript" ? { scriptFormat, value } : { scriptFormat, resource };
  return ModdleCreate(`${prefix}:Script`, scriptConfig);
}

// 更新元素扩展属性
export function updateElementExtensions(extensionList: Array<Object>, element?: any) {
  const extensions = ModdleCreate("bpmn:ExtensionElements", {
    values: extensionList
  });
  console.log('extensionList', typeof extensionList,  extensionList)
  console.log('bpmnEleListenerList',  extensions)
  updateProperties({ extensionElements: extensions });
}

// create bpmn moddle commonly
export function ModdleCreate<T>(element: any = window.bpmnInstances.bpmnElement, createObj: Object):T {
  return window.bpmnInstances.moddle.create(element, createObj)
}

// update Window.bpmnInstances when properties changed!
export function updateProperties(updateObj: any, bpmnElement: any = window.bpmnInstances.bpmnElement) {
  if (!updateObj) return console.warn('updateProperties is need bpmnElement and properties');
  try {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, updateObj);
  } catch (e: error) {
    console.warn(`Process is ${e}`)
  }
}

// 创建一个id
export function uuid(length: number = 8, chars?: any): string {
  let result = "";
  let charsString = chars || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
}
