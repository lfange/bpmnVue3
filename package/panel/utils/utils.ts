// 创建监听器实例
export function createListenerObject(options: any, isTask: Boolean, prefix: string):any {
  const listenerObj = Object.create(null);
  listenerObj.event = options.event;
  isTask && (listenerObj.id = options.id); // 任务监听器特有的 id 字段
  switch (options.listenerType) {
    case "scriptListener":
      listenerObj.script = createScriptObject(options, prefix);
      break;
    case "expressionListener":
      listenerObj.expression = options.expression;
      break;
    case "delegateExpressionListener":
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    default:
      listenerObj.class = options.class;
  }
  // 注入字段
  if (options.fields) {
    listenerObj.fields = options.fields.map(field => {
      return createFieldObject(field, prefix);
    });
  }
  // 任务监听器的 定时器 设置
  if (isTask && options.event === "timeout" && !!options.eventDefinitionType) {
    const timeDefinition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", {
      body: options.eventTimeDefinitions
    });
    const TimerEventDefinition = window.bpmnInstances.moddle.create("bpmn:TimerEventDefinition", {
      id: `TimerEventDefinition_${uuid(8)}`,
      [`time${options.eventDefinitionType.replace(/^\S/, s => s.toUpperCase())}`]: timeDefinition
    });
    listenerObj.eventDefinitions = [TimerEventDefinition];
  }
  return window.bpmnInstances.moddle.create(`${prefix}:${isTask ? "TaskListener" : "ExecutionListener"}`, listenerObj);
}

// 创建 监听器的注入字段 实例
export function createFieldObject(option, prefix) {
  const { name, fieldType, string, expression } = option;
  const fieldConfig = fieldType === "string" ? { name, string } : { name, expression };
  return window.bpmnInstances.moddle.create(`${prefix}:Field`, fieldConfig);
}

// 创建脚本实例
export function createScriptObject(options: any, prefix: string) {
  const { scriptType, scriptFormat, value, resource } = options;
  const scriptConfig = scriptType === "inlineScript" ? { scriptFormat, value } : { scriptFormat, resource };
  return window.bpmnInstances.moddle.create(`${prefix}:Script`, scriptConfig);
}

// 更新元素扩展属性
export function updateElementExtensions(element: any, extensionList: Object) {
  const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
    values: extensionList
  });
  window.bpmnInstances.modeling.updateProperties(element, {
    extensionElements: extensions
  });
}

// create bpmn moddle commonly
export function ModdleCreate(element: any, createObj: Object) {
  return window.bpmnInstances.moddle.create(element, createObj)
}

// 创建一个id
export function uuid(length = 8, chars: any) {
  let result = "";
  let charsString = chars || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
}


export function initListenerType(listener: any) {
  let listenerType;
  if (listener.class) listenerType = "classListener";
  if (listener.expression) listenerType = "expressionListener";
  if (listener.delegateExpression) listenerType = "delegateExpressionListener";
  if (listener.script) listenerType = "scriptListener";
  return {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType: listenerType
  };
}

export const listenerType = {
  classListener: "Java 类",
  expressionListener: "表达式",
  delegateExpressionListener: "代理表达式",
  scriptListener: "脚本"
};

export const eventType = {
  create: "创建",
  assignment: "指派",
  complete: "完成",
  delete: "删除",
  update: "更新",
  timeout: "超时"
};

export const fieldType = {
  string: "字符串",
  expression: "表达式"
};