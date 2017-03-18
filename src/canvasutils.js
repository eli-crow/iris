module.exports.drawTexture = function (context, img, x, y, width, height, rotation, opacity, erase) {
	context.save();
  context.translate(x,y);
  context.rotate(rotation);
  if (erase) context.globalCompositeOperation = 'destination-out';
  context.globalAlpha = opacity;
  context.drawImage(img, -width/2, -height/2, width, height);
  context.restore();
};

module.exports.getPixel = (context, x, y) => { 
	return context.getImageData(x,y,1,1).data;
};

module.exports.resizeCanvasComputed = function (canvas) {
	const cs = window.getComputedStyle(canvas);
	canvas.width = parseInt(cs.width);
	canvas.height = parseInt(cs.height);
}

module.exports.resizeToParent = function (canvas) {
  if (!canvas.parentElement) {
    console.log(canvas.parentElement);
    console.warn('canvas not in DOM tree');
    return false;
  }

  const cs = window.getComputedStyle(canvas.parentElement);
  canvas.width = parseInt(cs.width);
  canvas.height = parseInt(cs.height);
}

module.exports.drawTransparencyGrid  = function (canvas, size, color1, color2) {
  const ctx = canvas.getContext('2d');
  ctx.save();

  //generate the pattern
  let tCan = document.createElement('canvas');
  let tCtx = tCan.getContext('2d');
  tCan.width = size*2;
  tCan.height = size*2;

  tCtx.fillStyle = color1;
  tCtx.fillRect(0, 0, size, size);
  tCtx.fillRect(size, size, size, size);

  tCtx.fillStyle = color2;
  tCtx.fillRect(size, 0, size, size);
  tCtx.fillRect(0, size, size, size);

  //fill using pattern
  ctx.fillStyle = ctx.createPattern(tCan, 'repeat');
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  tCan = null;
  tCtx = null;

  ctx.restore();
}