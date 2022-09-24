export default (key: string, name: string, type: string) => {
  if (!type) type = "camunda";
  const TYPE_TARGET = {
    activiti: "http://activiti.org/bpmn",
    camunda: "http://bpmn.io/schema/bpmn",
    flowable: "http://flowable.org/bpmn",
  };
  // return `<?xml version="1.0" encoding="UTF-8"?>
  //           <bpmn2:definitions
  //             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  //             xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  //             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  //             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  //             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  //             id="diagram_${key}"
  //             targetNamespace="${TYPE_TARGET[type]}">
  //             <bpmn2:process id="${key}" name="${name}" isExecutable="true">
  //             </bpmn2:process>
  //             <bpmndi:BPMNDiagram id="BPMNDiagram_1">
  //               <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
  //               </bpmndi:BPMNPlane>
  //             </bpmndi:BPMNDiagram>
  //           </bpmn2:definitions>`;

  return `
  <?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:flowable="http://flowable.org/bpmn" id="diagram_Process_1655716822076" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.0.0">
  <bpmn2:process id="sdfs12" name="payent-trade" isExecutable="true" camunda:jobPriority="prioriy" camunda:candidateStarterGroups="groups" camunda:candidateStarterUsers="Candidate users" camunda:versionTag="v23.52.6" camunda:historyTimeToLive="Time to live" camunda:taskPriority="external task">
    <bpmn2:documentation>amountamountamountamount</bpmn2:documentation>
    <bpmn2:extensionElements>
      <camunda:executionListener expression="{expression}" event="start">
        <camunda:field name="fid">
          <camunda:string>in</camunda:string>
        </camunda:field>
      </camunda:executionListener>
      <camunda:properties>
        <camunda:property name="extensionprop" value="Values  ds" />
        <camunda:property name="extension properties2" value="value2" />
      </camunda:properties>
      <camunda:executionListener class="{Javaexpression}" event="start">
        <camunda:field name="jwww">
          <camunda:string>wfwe</camunda:string>
        </camunda:field>
      </camunda:executionListener>
    </bpmn2:extensionElements>
    <bpmn2:startEvent id="Event_0nuxc9s" name="payment-trade">
      <bpmn2:documentation>payment</bpmn2:documentation>
      <bpmn2:extensionElements>
        <flowable:formData />
      </bpmn2:extensionElements>
      <bpmn2:outgoing>Flow_1eqlvwr</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:sequenceFlow id="Flow_1eqlvwr" name="Flow 1" sourceRef="Event_0nuxc9s" targetRef="Activity_1fbuf1l" />
    <bpmn2:endEvent id="Event_0qnuyvn" name="payment-received">
      <bpmn2:documentation>SV是的是的</bpmn2:documentation>
      <bpmn2:incoming>Flow_0brnc9f</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:serviceTask id="Activity_1fbuf1l" name="charge credit card" camunda:type="external" camunda:topic="trade">
      <bpmn2:documentation>charge</bpmn2:documentation>
      <bpmn2:incoming>Flow_1eqlvwr</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0x4gs7i</bpmn2:outgoing>
    </bpmn2:serviceTask>
    <bpmn2:sequenceFlow id="Flow_0x4gs7i" sourceRef="Activity_1fbuf1l" targetRef="Activity_0yy9gb8" />
    <bpmn2:sequenceFlow id="Flow_0brnc9f" sourceRef="Activity_0yy9gb8" targetRef="Event_0qnuyvn" />
    <bpmn2:userTask id="Activity_0yy9gb8" name="user task">
      <bpmn2:incoming>Flow_0x4gs7i</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0brnc9f</bpmn2:outgoing>
    </bpmn2:userTask>
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="sdfs12">
      <bpmndi:BPMNEdge id="Flow_0brnc9f_di" bpmnElement="Flow_0brnc9f">
        <di:waypoint x="450" y="140" />
        <di:waypoint x="552" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0x4gs7i_di" bpmnElement="Flow_0x4gs7i">
        <di:waypoint x="270" y="140" />
        <di:waypoint x="350" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1eqlvwr_di" bpmnElement="Flow_1eqlvwr">
        <di:waypoint x="98" y="140" />
        <di:waypoint x="170" y="140" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="118" y="115" width="33" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_0nuxc9s_di" bpmnElement="Event_0nuxc9s">
        <dc:Bounds x="62" y="122" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="45" y="165" width="71" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0qnuyvn_di" bpmnElement="Event_0qnuyvn">
        <dc:Bounds x="552" y="122" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="528" y="165" width="88" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1mu0lmt_di" bpmnElement="Activity_1fbuf1l">
        <dc:Bounds x="170" y="100" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0svzv64_di" bpmnElement="Activity_0yy9gb8">
        <dc:Bounds x="350" y="100" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
      `;
};
