goog.provide("jchemhub.view.SingleBondEitherDrawing");

/**
 * A single bond stereo either graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.SingleBondEitherDrawing = function(x0, y0, x1, y1) {
	jchemhub.view.BondDrawing.call(this, x0, y0, x1, y1);
};
goog.inherits(jchemhub.view.SingleBondEitherDrawing, jchemhub.view.BondDrawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.SingleBondEitherDrawing.prototype.render = function() {
	// TTD implement wedge-shape
	var bondPath = new goog.graphics.Path();
	var bondStroke = new goog.graphics.Stroke(
			this.getConfig().get("bond").stroke.width, this.getConfig().get(
					"bond").stroke.color);
	var bondFill = null;
	
	var coords = this.transformCoords(this.getTransform(), [this._coord0, this._coord1]);

	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);

	this.getGraphics()
			.drawPath(bondPath, bondStroke, bondFill, this.getGroup());
	jchemhub.view.SingleBondEitherDrawing.superClass_.render.call(this);
}