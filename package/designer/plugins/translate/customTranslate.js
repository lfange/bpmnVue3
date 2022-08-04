import i18ns from './translations';
const translations = {}

Object.keys(i18ns).forEach(key => {
  translations[key.toUpperCase()] = i18ns[key]
})

export default function customTranslate(nativeWord, replacements) {
  replacements = replacements || {};
  
  let template = nativeWord.toUpperCase() || nativeWord
  // Translate
  // console.log('replacements', template, translations[template]);
  // console.warn('expect word is upperca')
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}