const glutils = require('./glutils.js');
const primatives = require('./primatives');

// maintains own uniforms and gl state.
class IrisPalette
{
	constructor (gl, fragmentSrc, vertexSrc, uniforms) {
		this.gl = gl;

		const vertShader = glutils.createShader(gl, vertexSrc, gl.VERTEX_SHADER);
		const fragShader = glutils.createShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);
		this.program = glutils.createAndLinkProgram(gl, vertShader, fragShader);
		gl.useProgram(this.program);

		this._uniforms = {};
		this.uniforms = {};
		this.addUniform('resolution', {type: '2f', value: [0,0]});
		this.addUniform('blend_reach', {type: '1f', value: 1});
		for (let name in uniforms) this.addUniform(name, uniforms[name]);

		this._positionLocation = gl.getAttribLocation(this.program, 'position');

		this._buffer = gl.createBuffer();
		this._pts = primatives.circle(1, 100);

		// for (var i = 0, ii = this._pts.length; i < ii; i+=2) {
		// 	console.log(this._pts[i] + ', ' + this._pts[i+1]);
		// }
	}

	activate() {
		const gl = this.gl;
		gl.useProgram(this.program);
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
		const self = this;

		descriptor.location = self.gl.getUniformLocation(self.program, name);
		const _uniform = self._uniforms[name] = descriptor;

		//at get/set interface to uniforms object.
		Object.defineProperty(self.uniforms, name, {
			get: function () {
				return self._uniforms[name].value;
			},
			set: function (value) {
				const _uniform = self._uniforms[name];
				glutils.uniformByType(self.gl, _uniform.type, _uniform.location, value);
				_uniform.value = value;
				self.draw();
			}
		});


		glutils.uniformByType(self.gl, _uniform.type, _uniform.location, _uniform.value);
	}
}

module.exports = IrisPalette;