<script >
import { ref } from 'vue'
// 引入相关的依赖
import Modeler from 'bpmn-js/lib/Modeler'

import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';

// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

import 'bpmn-js-properties-panel/dist/assets/properties-panel.css' // 右边工具栏样式
import 'bpmn-js-properties-panel/dist/assets/element-templates.css' // 右边工具栏样式
import DefaultEmptyXML from "./plugins/defaultEmpty";

import { DownloadOutlined, DownOutlined, FolderOpenOutlined } from '@ant-design/icons-vue';


import customTranslate from './plugins/translate/customTranslate'


import CustomPaletteProvider from "./plugins/palette";
export default {
  name: 'ProcessDesigner',
  components: {
    DownloadOutlined,
    DownOutlined,
    FolderOpenOutlined
  },
  data () {
    return {
      bpmnModeler: null
    }
  },
  mounted () {
    this.int()
  },
  methods: {
    int () {
      console.log('sss', CustomPaletteProvider)

      const customTranslates = {
        translate: [ 'value', customTranslate ]
      }

      this.bpmnModeler = new Modeler({
        container: '#canvas',
        propertiesPanel: {
          parent: '#properties'
          // parent: '#js-properties-panel'
        },
        additionalModules: [
          // 右边的属性栏
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          CamundaPlatformPropertiesProviderModule,
          CustomPaletteProvider,
          customTranslates    // 翻译
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      this.createNewDiagram()
    },

    async createNewDiagram (xml) {
      // 将字符串转换成图显示出来
      let newId = this.processId || `Process_${new Date().getTime()}`;
      let newName = this.processName || `业务流程_${new Date().getTime()}`;
      let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn));
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e?.message || e}`);
      }
      console.dir(this.bpmnModeler)

    },
    async downloadProcess (type, name) {
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
      function downloadFunc (href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },

    /*  ----------------------------------------------- refs methods------------------------------------------------------------- */ 
    // 下载不同类型文件
    downloadProcessAsFile (type) {
      this.downloadProcess(type)
    },
    // 根据所需类型进行转码并返回下载地址
    setEncoded (type, filename = "diagram", data) {
      const encodedData = encodeURIComponent(data);
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
      };
    },
    // 加载本地文件
    importLocalFile () {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },
  }
}

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

      <a-button>secondary</a-button>
    </div>
    <div class="modeler-designer">
      <div id="canvas" class="canvas" ref="canvas"></div>
      <div id="properties"></div>
    </div>
    <!-- 用于打开本地文件-->
    <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn" @change="importLocalFile" />
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
