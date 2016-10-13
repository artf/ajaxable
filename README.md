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
.on('start', function(params) {
  // Make stuff before each request, eg. start 'loading animation'
})
.on('end', function(params) {
  // Make stuff after each request, eg. stop 'loading animation'
})
.on('response', function(res, params) {
  // Make stuff after on response of each request
})
.on('error', function(err, params) {
  // Make stuff on errors
});
```
The `params` argument is an object containing additional data about the specific request. For example, `el` is the form
element which made the request and `activeRequests` indicates how many requests are still pending (useful with multiple forms)


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

Ajaxable extends `EventEmitter`

#### `ajaxable(element, [options])`
Init the form by providing the element, it can be either HTML selector or the form element (HTMLFormElement).
The options are optional and could contain:
* `responseType` - Define the response type, eg. `json`(default), `blob`, `arraybuffer`, leave empty if undefined
```js
ajaxable('.ajaxable', {responseType: ''});
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
