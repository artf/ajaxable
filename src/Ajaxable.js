import EventEmitter from 'tiny-emitter';

class Ajaxable extends EventEmitter{

  /**
   * Init the form by providing the element, it can be either HTML selector or the form element (HTMLFormElement).
   * The options are optional and could contain:
   * `responseType` - Define the response type, eg. `json`(default), `blob`, `arraybuffer`, leave empty if undefined
   * @param {string|HTMLFormElement} el
   * @param {Object} [options] Options
   * @example
   * ajaxable('form.ajaxable', {
   *  responseType: '',
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
    };

    let opts = options || {};
    for (var name in defaults) {
      if (!(name in opts))
        opts[name] = defaults[name];
    }

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
      this.els[i].dispatchEvent(new Event('submit'));
    }
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
    }if(!el.length){
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
  		}else{
        throw new Error('Validation failed');
        /*
        // If I need to submit form programmatically and trigger
        // HTML5 Validation .submit() doesn't work, it's necessary to .click()
        // on submitable element.
        // Solution: As some forms could not have a submit button I need to create
        // one, hide it and execute .click()
        el.querySelector('button').click();
        */
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
    this._ar++;
    let params = {el, req, activeRequests: this._ar};
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
  	let formData = new FormData(el);
    return formData;
  }

  /**
   * Check if the element is a valid form node
   * @param {HTMLFormElement} el
   * @private
   */
  checkForm(el) {
    if(!el || !(el instanceof HTMLFormElement)){
      throw new Error('The element is not a valid form');
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
            for(var i = eventHandlers.length; i--;) {
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
