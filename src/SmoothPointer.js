const Reactor = require('./Reactor.js');
const arrayutils = require('./arrayutils.js');

//todo: pull in  modernizr to test for existence.
const POINTER_EVENTNAME = 'pointer';
var sin = Math.sin,
    cos = Math.cos,
    abs = Math.abs,
    PI = Math.PI,
    max = Math.max,
    min = Math.min,
    sqrt = Math.sqrt,
    pow = Math.pow,
    atan2 = Math.atan2,
    random = Math.random,
    sign = Math.sign;

function getCubicPoints(input, output) {
  var a0,a1,a2;
  function component (t, y0, y1, y2, y3) {
    a0 = y3 - y2 - y0 + y1;
    a1 = y0 - y1 - a0;
    a2 = y2 - y0;
    return(a0*t*t*t + a1*t*t + a2*t + y1);
  }
   
  for(var i=0, ii = output.length; i < ii; i+=2) {
    var t = (i * .5 +.25) / (ii/2);
    output[i]   = component(t, input[0], input[2], input[4], input[6]);
    output[i+1] = component(t, input[1], input[3], input[5], input[7]);
  }
  return output;
}

function SmoothPointer(context, options)
{ 
  var self = this;
	this._steps = options['steps'] || 5;
	this._minSquaredDistance = Math.pow(options['minDistance'], 2) || 400;
  this._interpolatedPts = new Array(2*this._steps);
  this._smoothing = 0.3;
  
  let _squaredSpeed = 0;
  const _buffer = new Array(8);

	var _reactor = new Reactor(['down', 'move', 'up']);
	this.on = _reactor.addEventListener.bind(_reactor);
	this.off = _reactor.removeEventListener.bind(_reactor);

	function onPointerDown(e) {
	  _buffer[0] = _buffer[2] = _buffer[4] = _buffer[6] = e.clientX;
	  _buffer[1] = _buffer[3] = _buffer[5] = _buffer[7] = e.clientY;
    
	  _reactor.dispatchEvent('down', e);

	  e.preventDefault();
	  window.addEventListener(POINTER_EVENTNAME+'move', onPointerMove, false);
	}
	function onPointerMove(e) {
		_squaredSpeed = abs(
        pow(e.clientX - _buffer[0], 2) 
      + pow(e.clientY - _buffer[1], 2) 
    );

		if (_squaredSpeed > self._minSquaredDistance) {
      arrayutils.rotateArray(_buffer, 2);
      
      var diffx = e.clientX - _buffer[0];
      var diffy = e.clientY - _buffer[1];
      
		  _buffer[0] += diffx * (1 - self._smoothing);
		  _buffer[1] += diffy * (1 - self._smoothing);
      
		  _reactor.dispatchEvent('move', {
        pts: getCubicPoints(_buffer, self._interpolatedPts),
        squaredSpeed: _squaredSpeed,
        pressure: e.pressure || 0,
        direction: atan2(diffy, diffx) + PI
      });
		}
    e.preventDefault();
	}
	function onPointerUp(e) {
		window.removeEventListener(POINTER_EVENTNAME+'move', onPointerMove, false);
		_reactor.dispatchEvent('up', e);
	}
	context.addEventListener(POINTER_EVENTNAME+'down', onPointerDown, false);
  window.addEventListener(POINTER_EVENTNAME+'up', onPointerUp, false);
}

module.exports = SmoothPointer;