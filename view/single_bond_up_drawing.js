goog.provide("jchemhub.view.SingleBondUpDrawing");
goog.require("jchemhub.view.BondDrawing");

/**
 * A single bond stereo up graphical element in the reaction editor.
 * 
 * @param {jchemhub.model.Bond}
 *            bond
 * 
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.SingleBondUpDrawing = function(bond) {
	jchemhub.view.BondDrawing.call(this, bond);
};
goog.inherits(jchemhub.view.SingleBondUpDrawing, jchemhub.view.BondDrawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.SingleBondUpDrawing.prototype.render = function() {

	var bondPath = new goog.graphics.Path();
	var strokeWidth = this.getConfig().get("bond").stroke.width / 10;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.getConfig()
			.get("bond").stroke.color);
	var bondFill = new goog.graphics.SolidFill(
			this.getConfig().get("bond").fill.color);

	var theta = this.getTheta();
	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var trans1 = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_left)
			* strokeWidth, Math.sin(angle_left) * strokeWidth, 0, 0, 0);
	var target1 = this.transformCoords(trans1, [ this.bond.target.coord ])[0];
	var trans2 = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_right)
			* strokeWidth, Math.sin(angle_right) * strokeWidth, 0, 0, 0);
	var target2 = this.transformCoords(trans2, [ this.bond.target.coord ])[0];

	var coords = this.transformCoords(this.getTransform(), [ this.bond.source.coord,
			target1, target2 ]);

	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);
	bondPath.lineTo(coords[2].x, coords[2].y);

	this._elements.push(this.getGraphics().drawPath(bondPath, bondStroke,
			bondFill, this.getGroup()));

	jchemhub.view.SingleBondUpDrawing.superClass_.render.call(this);
}