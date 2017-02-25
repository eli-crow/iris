module.exports.drawTexture = function (context, img, x, y, width, height, rotation, opacity) {
	context.save();
  context.translate(x,y);
  context.rotate(rotation);
  context.globalAlpha = opacity;
  context.drawImage(img, -width/2, -height/2, width, height);
  context.restore();
};