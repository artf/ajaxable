import jsdom from 'jsdom';

//const virtualConsole = jsdom.createVirtualConsole();
//virtualConsole.on('log', console.log);

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;


global.document = doc;
global.window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});
