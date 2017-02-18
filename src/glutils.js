module.exports.uniformByType = function(gl, type, location, value) {
	switch(type)
	{
		case '1f': gl.uniform1f(location, value); break;
		case '2f': gl.uniform2f(location, ...value); break;
		case '3f': gl.uniform3f(location, ...value); break;
	}
};

module.exports.createShader = function(gl, sourceCode, type) {
	// Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
	var shader = gl.createShader( type );
	gl.shaderSource( shader, sourceCode );
	gl.compileShader( shader );

	if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
		var info = gl.getShaderInfoLog( shader );
		throw "Could not compile WebGL program. \n\n" + info;
	}
	return shader;
};

module.exports.createAndLinkProgram = function(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const info = gl.getProgramInfoLog(program);
		throw "could not compile WebGL program. \n\n" + info;
	}
	return program;
};