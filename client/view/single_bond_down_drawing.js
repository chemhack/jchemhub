goog.provide("chem.view.SingleBondDownDrawing");
goog.require("chem.view.BondDrawing");

/**
 * A single bond stereo down graphical element in the reaction editor.
 * 
 * @param {chem.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {chem.view.BondDrawing}
 */
chem.view.SingleBondDownDrawing = function(x0, y0, x1, y1) {
	chem.view.BondDrawing.call(this, x0, y0, x1, y1);
};
goog.inherits(chem.view.SingleBondDownDrawing, chem.view.BondDrawing);

/**
 * render this drawing and all its children
 */
chem.view.SingleBondDownDrawing.prototype.render = function() {
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
	chem.view.SingleBondDownDrawing.superClass_.render.call(this);
}