var Popover = require('popover'),
  Emitter = require('emitter');

module.exports = Picker;

/*global document*/

function clickOutside(elements, fn) {
  var self = {
    on: on,
    off: off,
    isClicked: isClicked
  }, clickedEl, handlers;

  function stop(e) {
    clickedEl = this;
    e.stopPropagation();
  }

  function pass() {
    clickedEl = undefined;
    fn();
  }

  function isClicked(el) {
    return el === clickedEl;
  }

  function on() {
    var html = document.documentElement;
    handlers = elements.map(function(el) {
      var handler = stop.bind(el);
      el.addEventListener('mousedown', handler);
      return handler;
    });
    html.addEventListener('mousedown', pass);
    return self;
  }

  function off() {
    var html = document.documentElement;
    html.removeEventListener('mousedown', pass);
    elements.forEach(function(el, i) {
      el.removeEventListener('mousedown', handlers[i]);
    });
    return self;
  }

  return self;
}

function useFocus(el) {
  var type, tag = el.tagName.toLowerCase();
  if (tag === 'input') {
    type = el.type;
    return type === 'text' || type === 'time' || type === 'date';
  }
  return (tag === 'textarea' || tag === 'select');
}


function Picker(el, item) {
  if (!(this instanceof Picker)) return new Picker(el, item);
  Emitter.call(this);
  this.el = el;
  this.item = item.on('change', this.onchange.bind(this));
  this._hasComplete = 'isComplete' in this.item;
  if (useFocus(el)) {
    el.addEventListener('focus', this.onfocus.bind(this));
    el.addEventListener('blur', this.onblur.bind(this));
  } else {
    el.addEventListener('click', this.onclick.bind(this));
  }
}

Emitter(Picker.prototype);

Picker.prototype.onclick = function() {
  if (this.el.disabled) {
    return;
  }
  this.show();
};

Picker.prototype.onfocus = function() {
  this.show();
};

Picker.prototype.onblur = function() {
  if (!this.clickOutside.isClicked(this.popover.el)) {
    this.hide();
  }
};

Picker.prototype.onchange = function(v, complete) {
  this.emit('change', v, complete);
  if (complete || !this._hasComplete) {
    this.hide();
  }
};

Picker.prototype.position = function(v) {
  this._position = v;
  return this;
};

Picker.prototype.show = function() {
  var self = this;
  if (this._visible) {
    return;
  }
  this._visible = true;
  if (!self.popover) {
    this.popover = new Popover(this.item.el)
      .on('show', function() {
        self.clickOutside.on();
        self.emit('show');
      })
      .on('hide', function() {
        self.emit('hide');
      });
    this.clickOutside = clickOutside([this.el, this.popover.el], this.hide.bind(this));
    this.popover.classname = 'picker popover';
    if (this._position) {
      this.popover.position(this._position);
    }
  }
  if (this._hasComplete) {
    this.item.resetComplete();
  }
  this.popover.show(this.el);
};

Picker.prototype.hide = function() {
  if (!this._visible) {
    return;
  }
  this._visible = false;
  if (this._hasComplete && !this.item.isComplete()) {
    this.emit('change', this.item.selected, true);
  }
  this.clickOutside.off();
  this.popover.hide();
  return this;
};
