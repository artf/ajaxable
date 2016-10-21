# [Ajaxable](https://ajaxable.js.org/)

[![Build Status](https://travis-ci.org/artf/ajaxable.svg?branch=master)](https://travis-ci.org/artf/ajaxable)
[![Coverage Status](https://coveralls.io/repos/github/artf/ajaxable/badge.svg?branch=master)](https://coveralls.io/github/artf/ajaxable?branch=master)

This library simply takes the standard HTML forms as an input and make them send requests via AJAX keeping HTML5 validations.

[Demo](https://ajaxable.js.org/)


## Installation

Download the file from [here](https://cdn.rawgit.com/artf/ajaxable/master/dist/ajaxable.min.js), via `npm i ajaxable` or get it directly from the `/dist` folder


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

[API Reference here](./docs/API.md)


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
