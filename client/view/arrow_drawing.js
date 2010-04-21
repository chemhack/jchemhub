goog.provide("chem.view.ArrowDrawing");

/**
 * An arrow graphical element in the reaction editor.
 * 
 * 
 * @constructor
 * @extends {chem.view.Drawing}
 */
chem.view.ArrowDrawing = function() {
	chem.view.Drawing.call(this);

};
goog.inherits(chem.view.ArrowDrawing, chem.view.Drawing);

/**
 * render this drawing and all its children
 */
chem.view.ArrowDrawing.prototype.render = function(){
	var path = new goog.graphics.Path();
	var stroke = new goog.graphics.Stroke(
			this.getConfig().get("arrow").stroke.width, this.getConfig().get(
					"arrow").stroke.color);
	var fill = null;
	var nock = new goog.math.Coordinate(0,0);
	var width = this.getConfig().get("arrow").width;
	var height = this.getConfig().get("arrow").height;
	var tip = new goog.math.Coordinate(width, 0);
	var head1 = new goog.math.Coordinate(width - height, height/2);
	var head2 = new goog.math.Coordinate(width - height, -height/2);
	var coords = this.transformCoords(this.getTransform(), [nock, tip, head1, head2]);

	path.moveTo(coords[0].x, coords[0].y);
	path.lineTo(coords[1].x, coords[1].y);
	path.lineTo(coords[2].x, coords[2].y);
	path.moveTo(coords[1].x, coords[1].y);
	path.lineTo(coords[3].x, coords[3].y);

	this.getGraphics()
			.drawPath(path, stroke, fill, this.getGroup());

};

/**
 * get bounding box size
 * 
 * @return {goog.math.Size}
 */
chem.view.ArrowDrawing.prototype.getSize = function(){

	return new goog.math.Size(this.getConfig().get("arrow").width, this.getConfig().get("arrow").height)
}

