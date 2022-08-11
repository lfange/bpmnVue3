
export function initListenerType(listener: any) {
  let listenerType: string = ''
  let expreValue: string = ''
  if (listener.class) { listenerType = "class"; expreValue = listener.class; }
  if (listener.expression) { listenerType = "expression"; expreValue = listener.expression; }
  if (listener.delegateExpression) { listenerType = "delegateExpression"; expreValue = listener.delegateExpression; }
  if (listener.script) { listenerType = "script"; expreValue = listener.script; }
  console.log('}', listenerType, expreValue)
  return {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType,
    expreValue
  };
}

export enum listenerType {
    class = "Java 表达式",
    expression = "表达式",
    delegateExpression = "代理表达式",
    script = "脚本"
}
// export const listenerType = {
//   class: "Java 表达式",
//   expression: "表达式",
//   delegateExpression: "代理表达式",
//   script: "脚本"
// };

export enum eventType {
  create = '创建'
}
// export const eventType = {
//   create: "创建",
//   assignment: "指派",
//   complete: "完成",
//   delete: "删除",
//   update: "更新",
//   timeout: "超时"
// };

export const fieldType = {
  string: "字符串",
  expression: "表达式"
};