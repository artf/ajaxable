class Ajaxable {

  constructor(el, clb) {
    if(!el){
      throw new Error('The element is empty');
    }
    this.checkForm = this.checkForm.bind(this);
    this.els = this.parseEl(el);
    this.clb = clb;

    for (let i = 0; i < this.els.length; i++) {
      this.bindForm(this.els[i], clb);
    }
  }

  /**
   * Capture events to avoid double binding
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
   * Remove captured events
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

  /**
   * Parse element data and return iterable object
   * @param {string|HTMLFormElement} el Form/s element
   * @return {Array<HTMLFormElement>|NodeList<HTMLFormElement>}
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
   * @param {Function} clb Callback function
   */
  bindForm(el, clb) {
    if(!(el instanceof HTMLFormElement)){
      throw new Error('The element is not a form');
    }
    const ev = 'submit';
    const checkForm = (e) => {
      if(el.checkValidity()){
  			e.preventDefault();
  			this.sendForm(el, clb);
  		}
  	};
    this.removeListeners(el, ev);
    this.addListener(el, ev, checkForm);
  }

  /**
   * Send form data
   */
  sendForm(el, clb) {
    //console.log('form sended', el);
  }
}

// Define static event handler
Ajaxable.prototype._eh = {};

export default Ajaxable;
