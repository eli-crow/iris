import Emitter from './Emitter.js';
import * as arrayutils from './arrayutils.js';
import * as mathutils from './mathutils.js';
import * as fnutils from './fnutils.js';
import * as listenerutils from './listenerutils.js';

const __baseSmoothing = .12;

const __defaults = {
  smoothing: 0.45,
  minDistance: 2,
  steps: 2
}

export default class SmoothPointer extends Emitter
{ 
  constructor(context, options) {
    super(['down', 'move', 'up'])

    const _posBuffer = new Array(8);
    let _lastPressure;

    this.steps = options['steps'] || __defaults['steps'];
    this.minDistance = options['minDistance'] || __defaults['minDistance'];
    this.minSquaredDistance = Math.pow(this.minDistance, 2);
    this.smoothing = options['smoothing'] || __defaults['smoothing'];
    this.scale = 1;
  
    if (fnutils.isFunction(options['down'])) this.on('down', options['down']);
    if (fnutils.isFunction(options['move'])) this.on('move', options['move']);
    if (fnutils.isFunction(options['up']))   this.on('up',   options['up']);

    let _squaredSpeed = 0;
    listenerutils.simplePointer(context, {
      useCapture: options['useCapture'],
      contained: false,
      relativeTo: options['relativeTo'],

      down: e => {
        for (var i = 0; i < 4; i++) {
          _posBuffer[2*i]    = e.relX/this.scale;
          _posBuffer[2*i +1] = e.relY/this.scale;
        }
        _lastPressure = 0;
        this.emit('down', e);
      },

      move: e => {
        const diffX = e.relX/this.scale - _posBuffer[0];
        const diffY = e.relY/this.scale - _posBuffer[1];
        const pressure = 
          (listenerutils.eventName === 'pointer') ? e.pressure :
          (listenerutils.eventName === 'touch') ? e.targetTouches[0].force :
          0.5;

        _squaredSpeed = Math.pow(diffX, 2) + Math.pow(diffY, 2);
        if (_squaredSpeed < this.minSquaredDistance) return;
        e.lastSquaredSpeed = _squaredSpeed;

        arrayutils.rotateArray(_posBuffer, 2);
        const smoothingDist = 1 - (__baseSmoothing + pressure * this.smoothing * (1 - __baseSmoothing));
        _posBuffer[0] += (e.relX/this.scale - _posBuffer[0]) * smoothingDist;
        _posBuffer[1] += (e.relY/this.scale - _posBuffer[1]) * smoothingDist;

        e.pts = mathutils.getLerpedCubicPoints2d(_posBuffer, this.steps, 2);
        e.squaredSpeed = _squaredSpeed;
        e.lastPressure = Math.max(_lastPressure * 1.2 - .2, 0);
        e.penPressure = Math.max(pressure * 1.2 - .2, 0);
        e.direction = Math.atan2(diffY, diffX) + Math.PI;
        
        _lastPressure = pressure;
        this.emit('move', e);
      },

      up: e => this.emit('up', e)
    })
  }
}