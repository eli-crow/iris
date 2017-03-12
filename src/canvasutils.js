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