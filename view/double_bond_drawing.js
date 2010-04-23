goog.provide("jchemhub.view.DoubleBondDrawing");
goog.require("jchemhub.view.BondDrawing");
goog.require("goog.math.Line");

/**
 * A double bond graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing} parent Drawing object
 *            
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.DoubleBondDrawing = function( x0, y0, x1, y1) {
	jchemhub.view.BondDrawing.call(this,  x0, y0, x1, y1);
};
goog.inherits(jchemhub.view.DoubleBondDrawing, jchemhub.view.BondDrawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.DoubleBondDrawing.prototype.render = function(){
	var bondPath1 = new goog.graphics.Path();
	var strokeWidth = this.getConfig().get("bond").stroke.width;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.getConfig().get(
					"bond").stroke.color);
	var bondFill = null;
	var coords = this.transformCoords(this.getTransform(), [this._coord0, this._coord1]);
	bondPath1.moveTo(coords[0].x, coords[0].y);
	bondPath1.lineTo(coords[1].x, coords[1].y);
	var bondPath2 = bondPath1.clone();
	var slope = this.perpendicularSlope(new goog.math.Line(coords[0].x, coords[0].y, coords[1].x, coords[1].y));
	var pathElement1 = this.getGraphics().drawPath(bondPath1, bondStroke,
			bondFill, this.getGroup());
	pathElement1.setTransformation(-slope.x * strokeWidth, -slope.y * strokeWidth, 0, 0, 0);

	var pathElement2 = this.getGraphics().drawPath(bondPath2, bondStroke,
			bondFill, this.getGroup());
	pathElement2.setTransformation(slope.x * strokeWidth, slope.y * strokeWidth, 0, 0, 0);

	jchemhub.view.DoubleBondDrawing.superClass_.render.call(this);
}