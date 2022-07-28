<script>
// import { ref } from "vue";
// 引入相关的依赖
import Modeler from "bpmn-js/lib/Modeler";
import axios from "axios";
// import qs from "qs";

import "bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";

// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

import "bpmn-js-properties-panel/dist/assets/properties-panel.css"; // 右边工具栏样式
import "bpmn-js-properties-panel/dist/assets/element-templates.css"; // 右边工具栏样式
import DefaultEmptyXML from "./plugins/defaultEmpty";

import { DownloadOutlined, DownOutlined, FolderOpenOutlined, EyeOutlined, RocketOutlined } from "@ant-design/icons-vue";

import customTranslate from "./plugins/translate/customTranslate";

import CustomPaletteProvider from "./plugins/palette";

import { message } from "ant-design-vue";

import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
// 引入json转换与高亮
import X2JS from "x2js";

import panel from "../panel/panel.vue";

export default {
  name: "ProcessDesigner",
  props: {
    events: {
      type: Array,
      default: () => ["element.click"],
    },
  },
  components: {
    DownloadOutlined,
    DownOutlined,
    FolderOpenOutlined,
    EyeOutlined,
    RocketOutlined,
    highlightjs: hljsVuePlugin.component,
    panel,
  },
  data() {
    return {
      bpmnModeler: null,
      previewModelVisible: false,
      previewResult: {
        result: "",
        previewType: "xml", // json
      },
    };
  },
  mounted() {
    this.initBpmnModeler()
    
  },
  methods: {
    initBpmnModeler() {
      const customTranslates = {
        translate: ["value", customTranslate],
      };

      this.bpmnModeler = new Modeler({
        container: "#canvas",
        propertiesPanel: {
          // parent: "#properties",
        },
        additionalModules: [
          // 右边的属性栏
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          CamundaPlatformPropertiesProviderModule,
          CustomPaletteProvider,
          customTranslates, // 翻译
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor,
        },
      });

      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();
      this.createNewDiagram();
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach((event) => {
        EventBus.on(event, function (eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async (event) => {
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("commandStack-changed", event);
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e.message || e}`);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", ({ viewbox }) => {
        this.$emit("canvas-viewbox-changed", { viewbox });
        const { scale } = viewbox;
        this.defaultZoom = Math.floor(scale * 100) / 100;
      });

      this.bpmnModeler.on("element.click", (e) => {
        console.log("element.click", e);
      });
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      let newId = this.processId || `Process_${new Date().getTime()}`;
      let newName = this.processName || `业务流程_${new Date().getTime()}`;
      let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        if (warnings && warnings.length) {
          warnings.forEach((warn) => console.warn(warn));
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e?.message || e}`);
      }
    },
    // 下载流程图到本地
    /**
     * @param {string} type
     * @param {*} name
     */
    async downloadProcess(type, name) {
      try {
        const _this = this;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await this.bpmnModeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`);
          }
          let { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml);
          downloadFunc(href, filename);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = _this.setEncoded("SVG", name, svg);
          downloadFunc(href, filename);
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },

    /*  -------------------------------------- refs methods -------------------------------------- */
    // 下载不同类型文件
    downloadProcessAsFile(type) {
      this.downloadProcess(type);
    },
    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = "diagram", data) {
      const encodedData = encodeURIComponent(data);
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
      };
    },
    // 加载本地文件
    importLocalFile() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },

    getFun() {
      // users    getApi
      axios.get('http://localhost:3000/users', 
      { 
        params: {
          methods: 'get APi.get',
          name: 'wangshi',
          age: 12
        }
      }, 
      {
        headers: { 
          // withCredentials: true
        },
      }
      ).then(res => {
        console.log('res', res);
      })
    },

    postFun() {
      axios.post('http://localhost:3000/postApi', 
        {
          json: 'json',
          name: 'wangshi',
          age: 16
        }, 
        {
          headers: { 
            // withCredentials: true
          },
        }
        ).then(res => {
          console.log('res', res);
        })
    },

    socketFun() {
      const socket = new WebSocket("ws://localhost:3000/connection");
      // Connection opened
      socket.addEventListener("open", function (event) {
        console.log("socketTest openopenopen");
      });
      // Listen for messages
      socket.addEventListener("message", function (event) {
        console.log("Message from server ", event.data);
      });
    },

    // 发布
    async deploy() {
      try {
        const { err, xml } = await this.bpmnModeler.saveXML();
        // 读取异常时抛出异常
        if (err) {
          return console.error(
            `[Process Designer Warn ]: ${err.message || err}`
          );
        }

        const dpm = new FormData();
        dpm.append("deployment-name", "payment");
        dpm.append("deployment-source", "Camunda Modeler");
        dpm.append("enable-duplicate-filtering", true);
        dpm.append(
          'Content-Disposition: form-data;name="payment.bpmn";filename="payment.bpmn";Content-Type: text/xml',
          new Blob([xml])
        );
        axios
          .post("http://localhost:8080/engine-rest/deployment/create", dpm)
          .then((res) => {
            const result = res.data;
            if (result.id) {
              message.success(
                `${result.name} is successfully deployed!!! please visit ${result.links[0].href}`,
                10
              );
            }
            console.log("dpmdpm", res);
          });
      } catch (e) {
        console.error(`[deploy is error]: ${e.message || e}`);
      }
    },

    /* ------------------------------------------  预览 ------------------------------------------ */
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        // const hjs = hljs.highlightAuto('xml').value

        this.previewResult.result = xml;
        this.previewResult.previewType = "xml";
        this.previewModelVisible = true;
      });
    },
    previewProcessJson() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        const newConvert = new X2JS();
        const { definitions } = newConvert.xml2js(xml);
        if (definitions) {
          this.previewResult.result = JSON.stringify(definitions, null, 4);
        } else {
          this.previewResult.result = "";
        }
        this.previewResult.previewType = "json";
        this.previewModelVisible = true;
      });
    },
  },
};
</script>

<template>
  <div class="process-designer">
    <div class="process-tooltik">
      <a-button type="primary" @click="$refs.refFile.click()">
        <template #icon>
          <FolderOpenOutlined />
        </template>
        打开文件
      </a-button>
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1">
              <a-button type="text" @click="downloadProcessAsFile('xml')">下载为XML</a-button>
            </a-menu-item>
            <a-menu-item key="2">
              <a-button type="text" @click="downloadProcessAsFile('svg')">下载为SVG文件</a-button>
            </a-menu-item>
            <a-menu-item key="3">
              <a-button type="text" @click="downloadProcessAsFile('bpmn')">下载为BPMN文件</a-button>
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="primary">
          <template #icon>
            <DownloadOutlined />
          </template>
          下载文件
          <DownOutlined />
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1">
              <a-button type="text" @click="previewProcessXML">预览XML</a-button>
            </a-menu-item>
            <a-menu-item key="2">
              <a-button type="text" @click="previewProcessJson">预览JSON</a-button>
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="primary">
          <template #icon>
            <eye-outlined />
          </template>
          预览
          <DownOutlined />
        </a-button>
      </a-dropdown>
      <a-button @click="getFun">getFun</a-button>
      <a-button @click="postFun">postFun</a-button>
      <a-button @click="socketFun">socketFun</a-button>
      <a-button type="primary" @click="deploy">
        <template #icon><rocket-outlined /></template> deploy
      </a-button>
    </div>
    <div class="modeler-designer">
      <div id="canvas" class="canvas" ref="canvas"></div>
      <!-- <div id="properties"></div> -->
    </div>
    <!-- <img style="width: 220px; height:auto" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABICAYAAACz6LpGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJJSURBVHgB7d0xThtBFIDht1ak0OGOEjrogAvAFXICOENu4BvkCBGcAG4QSipCBx0ldO6gwtnRZCVrZR62U3nzfdKwi1g6/5rZWVtuojWZzPaaJn62p0ftGAf8x9oWrt7f4/tk0jw1f+O4C2HAvOlsFsej9uRHiAP6xmVVNWp/fAtgkaNRAB8ZCwQSAoGEQCDxT4Hs70ccHgYM1pdY01H7SPHkpJ6P203im5uAwVkrkC6Oy8v6+9lZPYqEoVl5iTUfx3RaRzkvS63T04BBWSmQfhw7O3WIhKFaOpB+HMXBQR2FSBiipQJZFMciImFoPr1JL1u5/WVVN2vs7tZjF8PDQ8TLS7223Li/vUXc3gZsrE9nkK2tepzN6rFpPr62+9vra42j+1/YVJ/OIPf39TnH+XnExUXE83MdRTdzzG/vfv1ary0ziW1fNt1S9yDlhV5CKS/87e2Pr5uP4/o6YOMtvYu1KJLHxzoKcTBEKz0H6UfSLbfEwVCt/CS9H4k4GLK13ovV3XyXMMpulTgYqrXfzVsi6bZy7VYxVGsHUngIyND5RCEkBAIJgUBCIJAQCCQEAgmBQKKZzbpPegB9ZhBICAQSAoGEQCAhEEgIBBICgYRAICEQSAgEEgKBhEAgIRBICAQSAoGEQCAhEEgIBBICgYRAICEQSAgEEgKBhEAgIRBICAQSAoGEQCAhEEgIBBICgYRAICEQSAgEEgKBRAlkGsBCJZDfASxyXb7ldq89uWvHOIBOWVkdj5qmeSon7bgKoITxqx3HpY0/rjSf3htt6LcAAAAASUVORK5CYII=" alt=""> -->
    <!-- 用于打开本地文件-->
    <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn" @change="importLocalFile" />

    <a-modal v-model:visible="previewModelVisible" :title="`预览${previewResult.previewType}`" width="50%">
      <highlightjs :language="previewResult.previewType" :code="previewResult.result" />
    </a-modal>

    <!-- 控制面板 -->
    <panel />
  </div>
</template>

<style scoped>
.process-designer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.process-tooltik {
  margin-left: 16px;
}

.modeler-designer {
  flex: 1 1 auto;
  position: relative;
}

.canvas {
  width: 100%;
  height: 100%;
}

#properties {
  position: absolute;
  top: 20px;
  right: 16px;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>