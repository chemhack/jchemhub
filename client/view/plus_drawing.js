goog.provide("chem.view.PlusDrawing");

/**
 * An plus-sign graphical element in the reaction editor.
 * 
 * 
 * @constructor
 * @extends {chem.view.Drawing}
 */
chem.view.PlusDrawing = function() {
	chem.view.Drawing.call(this);

};
goog.inherits(chem.view.PlusDrawing, chem.view.Drawing);

/**
 * render this drawing and all its children
 */
chem.view.PlusDrawing.prototype.render = function(){
	var path = new goog.graphics.Path();
	var stroke = new goog.graphics.Stroke(
			this.getConfig().get("plus").stroke.width, this.getConfig().get(
					"plus").stroke.color);
	var fill = null;
	
	var c0 = new goog.math.Coordinate(0,0);
	var width = this.getConfig().get("plus").width;
	var c1 = new goog.math.Coordinate(width,0);
	var c2 = new goog.math.Coordinate(width/2, width/2);
	var c3 = new goog.math.Coordinate(width/2, -width/2);
	var tip = new goog.math.Coordinate(width, 0);

	var coords = this.transformCoords(this.getTransform(), [c0, c1, c2, c3]);

	path.moveTo(coords[0].x, coords[0].y);
	path.lineTo(coords[1].x, coords[1].y);
	path.moveTo(coords[2].x, coords[2].y);
	path.lineTo(coords[3].x, coords[3].y);

	this.getGraphics()
			.drawPath(path, stroke, fill, this.getGroup());

};

/**
 * get bounding box size
 * 
 * @return {goog.math.Size}
 */
chem.view.PlusDrawing.prototype.getSize = function(){

	return new goog.math.Size(this.getConfig().get("plus").width, this.getConfig().get("plus").width)
}

