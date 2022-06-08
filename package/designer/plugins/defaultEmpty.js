export default (key, name, type) => {
  if (!type) type = "camunda";
  const TYPE_TARGET = {
    activiti: "http://activiti.org/bpmn",
    camunda: "http://bpmn.io/schema/bpmn",
    flowable: "http://flowable.org/bpmn"
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
            <bpmn:definitions 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
            xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
            xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
            id="diagram_${key}"
            targetNamespace="${TYPE_TARGET[type]}">
              <bpmn:process id="${key}" name="${name}"  isExecutable="false">
                <bpmn:startEvent id="StartEvent_07jjg10" />
              </bpmn:process>
              <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
                  <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_07jjg10">
                    <dc:Bounds x="156" y="81" width="36" height="36" />
                  </bpmndi:BPMNShape>
                </bpmndi:BPMNPlane>
              </bpmndi:BPMNDiagram>
            </bpmn:definitions>`;
};