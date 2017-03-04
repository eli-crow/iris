const glutils = require('./glutils.js');
const primatives = require('./primatives');
const Emitter = require('./Emitter.js');

// maintains own programs, uniforms, geometry, and attributes.
// intended to be extended.
module.exports = class IrisPalette extends Emitter
{
	constructor (iris, fragmentSrc, vertexSrc, uniforms) {
		super(['uniformupdated']);

		this.uniforms = {};

		this._gl = iris._gl;
		this._uniforms = uniforms;
		this._pts = primatives.circle(1, 100);
		this._program = glutils.createAndLinkProgramFromSource(this._gl, vertexSrc, fragmentSrc);
		this._buffer = this._gl.createBuffer();

		this.init();
	}

	init () {
		this.activate();

		for (let name in this._uniforms) 
			this.addUniform(name, this._uniforms[name]);
		this.addUniform('resolution', {type: '2f', value: [0,0]});
		this.addUniform('blend_focus', {type: '1f', value: 0});
		this.addUniform('indicator_radius', {type: '1f', value: PUPIL_RADIUS});
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

	addUniform(name, uniform) {
		uniform.location = this._gl.getUniformLocation(this._program, name);
		this._uniforms[name] = uniform;

		//a get/set interface to uniforms object.
		//would be simpler as two methods.
		Object.defineProperty(this.uniforms, name, {
			get: () => this._uniforms[name].value,
			set: value => {
				const uniform = this._uniforms[name];
				this.use();
				glutils.uniformByType(this._gl, uniform.type, uniform.location, value);
				uniform.value = value;
				this.draw();
				this.emit('uniformupdated', uniform.value);
			}
		});

		glutils.uniformByType(this._gl, uniform.type, uniform.location, uniform.value);
	}

	getPositionFromLch (lchArr) {
		console.log('get position from lch');
	}

	getInputs () {
	}
}