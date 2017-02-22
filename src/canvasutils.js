module.exports.drawTexture = function (context, img, x, y, width, height, rotation) {
  context.translate(x,y);
  context.rotate(rotation);
  context.drawImage(img, -width/2, -height/2, width, height);
  context.rotate(-rotation);
  context.translate(-x,-y);
};