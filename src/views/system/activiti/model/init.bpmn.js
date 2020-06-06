export default `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="Examples">

	<process id="oneTaskProcess" name="The One Task Process">
		<startEvent id="theStart" />
		<sequenceFlow id="flow1" sourceRef="theStart" targetRef="theTask" />
		<userTask id="theTask" name="my task" />
		<sequenceFlow id="flow2" sourceRef="theTask" targetRef="theEnd" />
		<endEvent id="theEnd" />
	</process>
</definitions>
`
