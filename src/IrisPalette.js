const Emitter = require('./Emitter.js');
const Slider = require('./Slider.js');

const glutils = require('./glutils.js');
const objutils = require('./objutils.js');
const primatives = require('./primatives');

// interface IrisPaletteUniform
// {
//   type : string,
//   value : any
// }

// interface IrisPaletteProperty extends IrisPaletteUniform
// {
//   min : number,
//   max : number,
//   step : number,
//   ?map : Function,
//   ?name : string,
//   ?classes : string || string[]
// }

// maintains own programs, uniforms, geometry, and attributes.
module.exports = class IrisPalette extends Emitter
{
	constructor (iris, fragmentSrc, vertexSrc, properties, name) {
		super(['uniformupdated', 'inputchange']);

		this.name = name;

		this._uniforms = {};
		this._properties = {};
		this._inputs = null;
		
		this._gl = iris._gl;
		this._pts = primatives.circle(1, 100);
		this._program = glutils.createAndLinkProgramFromSource(this._gl, vertexSrc, fragmentSrc);
		this._buffer = this._gl.createBuffer();

		//init
		this.activate();

		this.addUniform('resolution', {type: '2f', value: [0,0]});
		this.addUniform('blend_focus', {type: '1f', value: 0});
		this.addUniform('indicator_radius', {type: '1f', value: PUPIL_RADIUS});
		for (let name in properties) {
			this.addProperty(name, properties[name]);
		}
	}

	use () {
		this._gl.useProgram(this._program)
	}

	activate() {
		this.use();

		const gl = this._gl;
		gl.bindAttribLocation(this._program, 0, 'position');
		gl.enableVertexAttribArray(0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._pts, gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
	}
	
	draw () {
		const gl = this._gl;
		gl.drawArrays(gl.TRIANGLE_FAN, 0, this._pts.length/2);
	}

	addUniform(name, descriptor) {
		descriptor.location = this._gl.getUniformLocation(this._program, name);
		this._uniforms[name] = descriptor;
		glutils.uniformByType(this._gl, descriptor.type, descriptor.location, descriptor.value);
	}

	addProperty(name, descriptor) {
		this._properties[name] = descriptor;
		this.addUniform(name, descriptor);
	}

	setUniform (name, value) {
		this.use();

		const u = this._uniforms[name];
		glutils.uniformByType(this._gl, u.type, u.location, value);
		u.value = value;

		this.draw();
		this.emit('uniformupdated');
	}
	getUniform (name) {
		return this._uniforms[name].value;
	}
	setProperty (name, value) {
		this.setUniform(name, value);
		const p = this._properties[name];
		glutils.uniformByType(this._gl, p.type, p.location, value);
		p.value = value;

		for (var i = 0, ii = this._inputs.length; i < ii; i++) {
			const input = this._inputs[i];
			if (input.propName === name) {
				input.setValue(value);
				break;
			}
		}
	}
	getProperty (name) {
		return this._properties[name].value;
	}

	resize (width, height) {
		this.setUniform('resolution', [width, height]);
	}

	getInputs() {
		if (this._inputs !== null) {
			return this._inputs;
		}

		const inputs = [];

		for (let name in this._properties) {
			const p = this._properties[name];
			const s = new Slider(p.value, p.min, p.max, p.step, p.name)
				.class(p.classes || null)
				.map(p.map || null)
				.unmap(p.unmap || null)
				.bind(val => this.setUniform(name, val))
				.on('input', () => this.emit('uniformupdated'))
				.on('change', () => this.emit('inputchange'));

			s.propName = name;
			inputs.push(s);
		}

		this._inputs = inputs;
		return inputs;
	}
};