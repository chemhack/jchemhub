goog.provide("jchemhub.view.PlusDrawing");

/**
 * An plus-sign graphical element in the reaction editor.
 * 
 * @param {goog.math.Coordinate} center_coord The coordinates of the center of the plus
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.PlusDrawing = function(center_coord) {
	jchemhub.view.Drawing.call(this);
	var width = .25;
	this._h0 = new goog.math.Coordinate(center_coord.x - width/2,center_coord.y);
	this._h1 = new goog.math.Coordinate(this._h0.x + width, this._h0.y);
	this._v0 = new goog.math.Coordinate(center_coord.x, center_coord.y + width/2);
	this._v1 = new goog.math.Coordinate(this._v0.x, this._v0.y - width);

};
goog.inherits(jchemhub.view.PlusDrawing, jchemhub.view.Drawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.PlusDrawing.prototype.render = function(){
	var path = new goog.graphics.Path();
	var stroke = new goog.graphics.Stroke(
			this.getConfig().get("plus").stroke.width, this.getConfig().get(
					"plus").stroke.color);
	var fill = null;
	



	var coords = this.transformCoords(this.getTransform(), [this._h0, this._h1, this._v0, this._v1]);

	path.moveTo(coords[0].x, coords[0].y);
	path.lineTo(coords[1].x, coords[1].y);
	path.moveTo(coords[2].x, coords[2].y);
	path.lineTo(coords[3].x, coords[3].y);

	this.getGraphics()
			.drawPath(path, stroke, fill, this.getGroup());

};

/**
 * @override
 */
jchemhub.view.PlusDrawing.prototype.getCoords = function(){

	return [this._h0, this._h1, this._v0, this._v1];
}

jchemhub.view.Drawing.prototype.updateTransformedCoords = function(){};

