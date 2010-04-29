goog.provide("jchemhub.view.TripleBondDrawing");

/**
 * A triple bond graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.TripleBondDrawing = function(x0, y0, x1, y1) {
	jchemhub.view.BondDrawing.call(this, x0, y0, x1, y1);
};
goog.inherits(jchemhub.view.TripleBondDrawing, jchemhub.view.BondDrawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.TripleBondDrawing.prototype.render = function() {

	var strokeWidth = this.getConfig().get("bond").stroke.width;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.getConfig().get(
					"bond").stroke.color);
	var bondFill = null;
	
	var bondPath1 = new goog.graphics.Path();
	var coords = this.transformCoords(this.getTransform(), [this._coord0, this._coord1]);
	bondPath1.moveTo(coords[0].x, coords[0].y);
	bondPath1.lineTo(coords[1].x, coords[1].y);

	var bondPath2 = bondPath1.clone();
	var bondPath3 = bondPath1.clone();
	
	var slope = this.perpendicularSlope(new goog.math.Line(coords[0].x, coords[0].y, coords[1].x, coords[1].y));
	var pathElement1 = this.getGraphics().drawPath(bondPath1, bondStroke,
			bondFill, this.getGroup());
	var pathElement2 = this.getGraphics().drawPath(bondPath2, bondStroke,
			bondFill, this.getGroup());
	var pathElement3 = this.getGraphics().drawPath(bondPath3, bondStroke, bondFill, this.getGroup());
	
	pathElement3.setTransformation(-slope.x * 2 * strokeWidth, -slope.y * 2 * strokeWidth, 0, 0, 0);

	pathElement2.setTransformation(slope.x * 2 * strokeWidth, slope.y * 2 * strokeWidth, 0, 0, 0);
	this._elements.push(pathElement1);
	this._elements.push(pathElement2);
	this._elements.push(pathElement3);
	jchemhub.view.TripleBondDrawing.superClass_.render.call(this);

}