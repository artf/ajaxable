# Ajaxable

Make your form instantly ajaxable. This library simply takes the standard HTML form as an input and make it send requests via AJAX keeping HTML5 validations.


## Installation

Download the file from [here](https://cdn.rawgit.com/artf/ajaxable/master/dist/ajaxable.min.js) or get it directly from the `/dist` folder


## Usage

Basic

```html
<script src="path/to/ajaxable.min.js"></script>

<form id="myform" method="POST" action="https://se.nd/it/somewhere">
  <input name="name" placeholder="Name"/>
  <input name="email" placeholder="Email" type="email" required/>
  <button>Send</button>
</form>

<script type="text/javascript">
  ajaxable('#myform');
</script>
```

Listen events

```js
ajaxable('#myform')
.onStart(function(params) {
  // Make stuff before each request, eg. start 'loading animation'
})
.onEnd(function(params) {
  // Make stuff after each request, eg. stop 'loading animation'
})
.onResponse(function(res, params) {
  // Make stuff after on response of each request
})
.onError(function(err, params) {
  // Make stuff on errors
});
```
The `params` argument is an object containing additional data about the specific request. For example, `el` is the form element which made the request and `activeRequests` indicates how many requests are still pending (useful with multiple forms)


## Development

Clone the repository and enter inside the folder

```sh
$ git clone https://github.com/artf/ajaxable.git
$ cd ajaxable
```

Install it

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build before the commit. This will also increase the patch level version of the package

```sh
$ npm run build
```


## API

# constructor

Init the form by providing the element, it can be either HTML selector or the form element (HTMLFormElement).
The options are optional and could contain:
`responseType` - Define the response type, eg. `json`(default), `blob`, `arraybuffer`, leave empty if undefined

**Parameters**

-   `el` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement))**
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Options

**Examples**

```javascript
ajaxable('form.ajaxable', {
 responseType: '',
});
```

# onStart

Bind a callback and execute it on start of each request
The callback accepts parameters object as argument

**Parameters**

-   `clb` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Callback function

**Examples**

```javascript
ajaxable('...').onStart((params) => {
 // do stuff
})
```

# onEnd

Bind a callback and execute it on end of each request
The callback accepts parameters object as argument

**Parameters**

-   `clb` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Callback function

**Examples**

```javascript
ajaxable('...').onEnd((params) => {
 // do stuff
})
```

# onResponse

Bind a callback and execute it on response of each request
The callback accepts the response and parameters as arguments

**Parameters**

-   `clb` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Callback function

**Examples**

```javascript
ajaxable('...').onResponse((res, params) => {
 // do stuff
})
```

# onError

Bind a callback and execute it on error of each request
The callback accepts the error and parameters as arguments

**Parameters**

-   `clb` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Callback function

**Examples**

```javascript
ajaxable('...').onError((err, params) => {
 // do stuff
})
```

# submit

Submit the request

**Examples**

```javascript
ajaxable('...').submit();
```


## Testing

Run tests

```sh
$ npm test
```

Run and watch tests

```sh
$ npm run test:dev
```

## Compatibility

All modern browsers (IE > 9)

## License

MIT
