
import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
