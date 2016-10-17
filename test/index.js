import expect from 'expect';
import sinon from 'sinon';
import ajaxable from './../src';

describe('Ajaxable', () => {
  let obj;
  let form;
    let d = document;

  beforeEach(() => {
    form = `<form id="form1" class="forms"></form>
            <form id="form2" class="forms"></form>`;
    d.body.innerHTML = form;
  });

  it('Throws error without element', () => {
    expect(() => {
      obj = ajaxable();
    }).toThrow();
  });

  it('Init with string, single element', () => {
    const el = ajaxable('#form1').els;
    expect(el.length).toEqual(1);
  });

  it('Init with string, multiple elements', () => {
    const el = ajaxable('.forms').els;
    expect(el.length).toEqual(2);
  });

  it('Init with the dom', () => {
    const el = ajaxable(d.getElementById('form1')).els;
    expect(el.length).toEqual(1);
  });

  describe('Ajaxable methods', () => {
    let formEl;
    let formEl2;
    let requests;
    let xhr;

    beforeEach(() => {
      form = `<form id="formel1" class="forms">
                <button id="send-data"></button>
              </form>
              <form id="formel2" class="forms">
                <input name="name1" value="value1"/>
                <button id="send-data2"></button>
              </form>`;
      d.body.innerHTML = form;
      formEl = d.getElementById('formel1');
      formEl2 = d.getElementById('formel2');
      obj = ajaxable('#formel2');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function(xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function() {
      xhr.restore();
    });

    it('Adds event listener correctly', (done) => {
      obj.addListener(formEl, 'submit', (e) => {
        done();
      });
      d.getElementById('send-data').click();
    });

    it('Removes event listener correctly', (done) => {
      obj.addListener(formEl, 'submit', (e) => {
        done(new Error('Not expected to submit'));
      });
      obj.removeListeners(formEl, 'submit');
      d.getElementById('send-data').onclick = () => {
        done();
      };
      d.getElementById('send-data').click();
    });

    it('Triggers onStart on sendForm', (done) => {
      let formEl = d.getElementById('formel2');
      obj.onStart((params) => {
        expect(params.el.id).toEqual(formEl.id);
        done();
      });
      obj.sendForm(formEl);
    });

    it('Triggers onResponse on sendForm, auto parse JSON', (done) => {
      const data = {test: 'value'};
      obj.onResponse((res, params) => {
        expect(res).toEqual(data);
        done();
      });
      obj.sendForm(formEl2);
      requests[0].respond(200,
        {'Content-Type': 'text/json'},
        JSON.stringify(data));
    });

    it('Triggers onResponse on sendForm, do not parse JSON', (done) => {
      obj = ajaxable('#formel2', {responseType: ''});
      const data = {test: 'value'};
      obj.onResponse((res, params) => {
        expect(res).toEqual(JSON.stringify(data));
        done();
      });
      obj.sendForm(formEl2);
      requests[0].respond(200,
        {'Content-Type': 'text/json'},
        JSON.stringify(data));
    });

    it('Triggers onError on sendForm, with wrong JSON', (done) => {
      const data = {test: 'value'};
      obj.onError((err, params) => {
        expect(err).toExist();
        done();
      });
      obj.sendForm(formEl2);
      requests[0].respond(200,
        {'Content-Type': 'text/json'},
        JSON.stringify(data)+'test');
    });

    it('Triggers onError on sendForm', (done) => {
      const data = {test: 'value'};
      obj.onError((err, params) => {
        expect(err).toExist();
        done();
      });
      obj.sendForm(formEl2);
      requests[0].respond();
    });

    it.skip('Sends X-Requested-With in the headers', (done) => {
      //this.requests[0].respond(500); // for failures
    });


  })

});
