const glutils = require('./glutils.js');
const primatives = require('./primatives');

// maintains own programs, uniforms, geometry, and attributes.
class IrisPalette
{
	constructor (iris, name, fragmentSrc, vertexSrc, uniforms) {
		this.iris = iris;
		const gl = this.gl = iris._gl;
		this.name = name;

		const vertShader = glutils.createShader(gl, vertexSrc, gl.VERTEX_SHADER);
		const fragShader = glutils.createShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);
		this._program = glutils.createAndLinkProgram(gl, vertShader, fragShader);

		this.use();
		this._uniforms = {};
		this.uniforms = {};
		this.addUniform('resolution', {type: '2f', value: [0,0]});
		this.addUniform('blend_focus', {type: '1f', value: 0});
		for (let name in uniforms) this.addUniform(name, uniforms[name]);

		this._positionLocation = gl.getAttribLocation(this._program, 'position');

		this._buffer = gl.createBuffer();
		this._pts = primatives.circle(1, 100);
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

		//at get/set interface to uniforms object.
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