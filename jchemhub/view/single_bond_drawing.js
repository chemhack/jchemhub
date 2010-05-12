goog.provide("jchemhub.view.SingleBondDrawing");

/**
 * A single bond graphical element in the reaction editor.
 * 
 * @param {jchemhub.model.Bond}
 *            bond
 * 
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.SingleBondDrawing = function(bond) {
	jchemhub.view.BondDrawing.call(this, bond);
};
goog.inherits(jchemhub.view.SingleBondDrawing, jchemhub.view.BondDrawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.SingleBondDrawing.prototype.render = function() {

	var bondPath = new goog.graphics.Path();
	var bondStroke = new goog.graphics.Stroke(
			this.getConfig().get("bond").stroke.width, this.getConfig().get(
					"bond").stroke.color);
	var bondFill = null;
	
	var coords = this.transformCoords(this.getTransform(), this.getCoords());

	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);

	this._elements.push(this.getGraphics()
			.drawPath(bondPath, bondStroke, bondFill, this.getGroup()));
	jchemhub.view.SingleBondDrawing.superClass_.render.call(this);

}
