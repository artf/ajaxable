import EventEmitter from 'tiny-emitter';

class Ajaxable extends EventEmitter{

  /**
   * Init the form by providing the element, it can be either HTML selector or the form element (HTMLFormElement).
   * @param {string|HTMLFormElement} el
   * @param {Object} [options] Options
   * @param {string} [options.responseType] Define the response type, eg. `json`(default), `blob`, `arraybuffer`, leave empty if undefined
   * @param {Object} [options.headers] Define custom headers
   * @example
   * ajaxable('form.ajaxable', {
   *  responseType: '',
   *  headers: {
   *    'Content-Type': 'text/html; charset=UTF-8'
   *  }
   * });
   */
  constructor(el, options = '') {
    super();
    if(!el){
      throw new Error('The element is empty');
    }
    // Default options
    const defaults = {
      responseType: 'json',
      headers: {},
    };

    let opts = options || {};
    for (let name in defaults) {
      if (!(name in opts))
        opts[name] = defaults[name];
    }

    // Set default X-Requested-With if not setted
    const reqHead = 'X-Requested-With';
    if(opts.headers[reqHead] != '')
      opts.headers[reqHead] = 'XMLHttpRequest';

    this.els = this.parseEl(el);
    this.opts = opts;

    for (let i = 0; i < this.els.length; i++) {
      this.bindForm(this.els[i]);
    }
  }

  /**
   * Bind a callback and execute it on start of each request
   * The callback accepts parameters object as argument
   * @param {Function} clb Callback function
   * @example
   * ajaxable('...').onStart((params) => {
   *  // do stuff
   * })
   */
  onStart(clb){
    return this.on('start', clb);
  }

  /**
   * Bind a callback and execute it on end of each request
   * The callback accepts parameters object as argument
   * @param {Function} clb Callback function
   * @example
   * ajaxable('...').onEnd((params) => {
   *  // do stuff
   * })
   */
  onEnd(clb){
    return this.on('end', clb);
  }

  /**
   * Bind a callback and execute it on response of each request
   * The callback accepts the response and parameters as arguments
   * @param {Function} clb Callback function
   * @example
   * ajaxable('...').onResponse((res, params) => {
   *  // do stuff
   * })
   */
  onResponse(clb){
    return this.on('response', clb);
  }

  /**
   * Bind a callback and execute it on error of each request
   * The callback accepts the error and parameters as arguments
   * @param {Function} clb Callback function
   * @example
   * ajaxable('...').onError((err, params) => {
   *  // do stuff
   * })
   */
  onError(clb){
    return this.on('error', clb);
  }

  /**
   * Submit the request
   * @example
   * ajaxable('...').submit();
   */
  submit() {
    for (let i = 0; i < this.els.length; i++) {
      this.send(this.els[i]);
    }
  }

  /**
   * Trigger form submit.
   * If I need to submit form programmatically and trigger
   * HTML5 Validation .submit() doesn't work, it's necessary
   * to 'click()' on a submitable element.
   * @param {HTMLFormElement} el Form element
   * @private
   */
  send(el) {
    const id = '_aj_btn';
    let subEl = el.querySelector('#' + id);
    if(!subEl){
      subEl = el.appendChild(document.createElement('button'));
      subEl.id = id;
      subEl.style.display = 'none';
    }
    subEl.click();
  }

  /**
   * Parse element data and return iterable object
   * @param {string|HTMLFormElement} el Form/s element
   * @return {Array<HTMLFormElement>|NodeList<HTMLFormElement>}
   * @private
   */
  parseEl(el) {
    if(typeof el === 'string'){
      el = document.querySelectorAll(el);
    }if(!el.length ||
      el instanceof window.HTMLElement){
        el = [el];
    }
    return el;
  }

  /**
   * Bind submit event to the form
   * @param {HTMLFormElement} el Form element
   * @private
   */
  bindForm(el) {
    this.checkForm(el);
    const ev = 'submit';
    const checkForm = (e) => {
      if(el.checkValidity()){
  			e.preventDefault();
  			this.sendForm(el);
  		}
  	};
    this.removeListeners(el, ev);
    this.addListener(el, ev, checkForm);
  }

  /**
   * Send form data
   * @param {HTMLFormElement} el Form element
   * @private
   */
  sendForm(el) {
    const formData = this.fetchData(el);
    let req = new XMLHttpRequest();
    let headers = this.opts.headers;
    this._ar++;
    let params = {
      el,
      req,
      activeRequests: this._ar,
      requestData: this.fetchFormData(formData)
    };
    this.emit('start', params);
    req.addEventListener("progress", (e) =>
      this.emit('progress', e, el, req)
    );
    req.addEventListener("load", (e) => {
      const toJson = this.opts.responseType == 'json';
      let response = '';
      try{
        response = toJson ? JSON.parse(req.responseText) : req.response;
      }catch(err){
        this.emit('error', err, params);
        return;
      }
      this.emit('response', response, params);
    });
    req.addEventListener("error", (e) =>
      this.emit('error', e, params)
    );
    req.addEventListener("loadend", (e) => {
      this._ar--;
      params.activeRequests = this._ar;
      this.emit('end', params)
    });
    req.open(el.method, el.action);

    // Set headers
    for (let head in headers){
      req.setRequestHeader(head, headers[head]);
    }

    req.send(formData);
  }

  /**
   * Fetch data from the form element
   * @param {HTMLFormElement} el Form element
   * @return {FormData}
   * @private
   */
  fetchData(el) {
    this.checkForm(el);
  	let formData = new window.FormData(el);
    return formData;
  }

  /**
   * Fetch data from the FormData object
   * @param {FormData} fd
   * @return {Object}
   * @private
   */
  fetchFormData(fd) {
    let obj = {};
    if(fd.entries){
      for(let pair of fd.entries()) {
        obj[pair[0]] = pair[1];
      }
    }
    return obj;
  }

  /**
   * Check if the element is a valid form node
   * @param {HTMLFormElement} el
   * @private
   */
  checkForm(el) {
    if(!el || !(el instanceof window.HTMLFormElement)){
      let name = el.constructor.name;
      throw new Error(`The element is not a valid form, ${name} given`);
    }
  }

  /**
   * Add listener helper
   * @param {HTMLElement} node
   * @param {string} event
   * @param {function} handler
   * @private
   */
  addListener(node, event, handler) {
    if(!(node in this._eh))
        this._eh[node] = {};
    if(!(event in this._eh[node]))
        this._eh[node][event] = [];
    this._eh[node][event].push(handler);
    node.addEventListener(event, handler);
  }

  /**
   * Remove listener helper
   * @param {HTMLElement} node
   * @param {string} event
   * @private
   */
  removeListeners(node, event) {
    if(node in this._eh) {
      let handlers = this._eh[node];
        if(event in handlers) {
          let eventHandlers = handlers[event];
            for(let i = eventHandlers.length; i--;) {
              let handler = eventHandlers[i];
              node.removeEventListener(event, handler);
            }
        }
    }
  }
}

// Define static event handler
Ajaxable.prototype._eh = {};
// Define static variable which indicates active requests
Ajaxable.prototype._ar = 0;

export default Ajaxable;
