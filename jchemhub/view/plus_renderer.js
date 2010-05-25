goog.provide('jchemhub.view.PlusRenderer');
goog.require('jchemhub.view.Renderer');

/**
 * Class to render an Plus object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.PlusRenderer = function(parentEventTarget, graphics, opt_config) {
	jchemhub.view.Renderer.call(this, parentEventTarget, graphics, opt_config,
			jchemhub.view.PlusRenderer.defaultConfig);
}
goog.inherits(jchemhub.view.PlusRenderer, jchemhub.view.Renderer);

jchemhub.view.PlusRenderer.prototype.render=function(coord, transform){
	var w = this.config.get('plus').size;
	h0 = new goog.math.Coordinate(coord.x,coord.y - w);
	h1 = new goog.math.Coordinate(coord.x, coord.y + w);
	v0 = new goog.math.Coordinate(coord.x - w, coord.y);
	v1 = new goog.math.Coordinate(coord.x + w, coord.y);
	
	var path = new goog.graphics.Path();
	var stroke = new goog.graphics.Stroke(
			this.config.get("plus").stroke.width, this.config.get(
					"plus").stroke.color);
	var fill = null;
	
	var coords = transform.transformCoords( [h0, h1, v0, v1]);

	path.moveTo(coords[0].x, coords[0].y);
	path.lineTo(coords[1].x, coords[1].y);
	path.moveTo(coords[2].x, coords[2].y);
	path.lineTo(coords[3].x, coords[3].y);

	this.graphics.drawPath(path, stroke, fill);
}

/**
 * A default configuration for renderer
 */
jchemhub.view.PlusRenderer.defaultConfig = {
		plus : {
	size: .125,
	stroke : {
		width : 2,
		color : "black"
	}
}
}


