const glutils = require('./glutils.js');
const primatives = require('./primatives');

// maintains own programs, uniforms, geometry, and attributes.
class IrisPalette
{
	constructor (iris, fragmentSrc, vertexSrc, uniforms) {
		this.iris = iris;
		this.gl = iris._gl;
		this.uniforms = {};

		this._uniforms = uniforms;
		this._pts = primatives.circle(1, 100);
		this._program = glutils.createAndLinkProgramFromSource(this.gl, vertexSrc, fragmentSrc);

		this.use();

		this._positionLocation = this.gl.getAttribLocation(this._program, 'position');
		this._buffer = this.gl.createBuffer();

		this.init();
	}

	init () {
		for (let name in this._uniforms) 
			this.addUniform(name, this._uniforms[name]);
		this.addUniform('resolution', {type: '2f', value: [0,0]});
		this.addUniform('blend_focus', {type: '1f', value: 0});
		this.addUniform('indicator_radius', {type: '1f', value: PUPIL_RADIUS});
	}

	use () {
		this.gl.useProgram(this._program)
	}

	activate() {
		const gl = this.gl;
		gl.useProgram(this._program);
		gl.enableVertexAttribArray(this._positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._pts, gl.STATIC_DRAW);
		gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);
	}
	
	draw () {
		const gl = this.gl;
		gl.drawArrays(gl.TRIANGLE_FAN, 0, this._pts.length/2);
	}

	addUniform(name, descriptor) {
		descriptor.location = this.gl.getUniformLocation(this._program, name);
		const _uniform = this._uniforms[name] = descriptor;

		//a get/set interface to uniforms object.
		//would be simpler as two methods.
		Object.defineProperty(this.uniforms, name, {
			get: () => {
				return this._uniforms[name].value;
			},
			set: (value) => {
				const _uniform = this._uniforms[name];
				glutils.uniformByType(this.gl, _uniform.type, _uniform.location, value);
				_uniform.value = value;
				this.draw();
				this.iris.emitColors('pick', null, false);
			}
		});

		glutils.uniformByType(this.gl, _uniform.type, _uniform.location, _uniform.value);
	}
}

module.exports = IrisPalette;