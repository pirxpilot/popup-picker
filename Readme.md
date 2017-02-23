
# picker

  Building block for a floating interactive popup

  ![Picker](https://gist.github.com/pirxpilot/5011178/raw/9a02c67f55d648cfd65f73d8ff9be81675b79d07/picker-preview.png)


## Installation

    $ npm install popup-picker

## Example

```js
var Picker = require('picker');
new Picker(el, new Clock())
  .on('change', function(v) {
    var value = (v.hour || '0') + ':' + (v.minute || '00');
  });
```

## Events

  - `change` (time) - when content item g selected time is modified

  - `show` [popover] show event
  - `hide` [popover] hide event

## API

### new Picker(el, item)

Create a new Picker attached to `el` input DOM node
`item` - interactive element such as [clock] or [calendar]

### item

Direct access to `item` passed in constructor

## License

  MIT

[popover]: https://github.com/pirxpilot/popover
[clock]: https://github.com/pirxpilot/clock
[calendar]: https://github.com/pirxpilot/calendar