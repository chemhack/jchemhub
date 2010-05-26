goog.provide('jchemhub.view.SingleUpBondRenderer');
goog.require('jchemhub.view.BondRenderer');

/**
 * Class to render a Single-Up bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.BondRenderer}
 */
jchemhub.view.SingleUpBondRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.BondRenderer.call(this, controller, graphics, opt_config,
			jchemhub.view.SingleUpBondRenderer.defaultConfig);

}
goog.inherits(jchemhub.view.SingleUpBondRenderer, jchemhub.view.BondRenderer);

jchemhub.view.SingleUpBondRenderer.prototype.render = function(bond, transform,
		group) {
	jchemhub.view.SingleUpBondRenderer.superClass_.render.call(this, bond,
			transform, group);

	var bondPath = new goog.graphics.Path();
	var strokeWidth = this.config.get("bond").stroke.width / 10;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.config
			.get("bond").stroke.color);
	var bondFill = new goog.graphics.SolidFill(
			this.config.get("bond").fill.color);

	var theta = jchemhub.view.BondRenderer.getTheta(bond);
	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var trans1 = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* strokeWidth, Math.sin(angle_left) * strokeWidth);

	var target1 = trans1.transformCoords( [ bond.target.coord ])[0];

	var trans2 = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* strokeWidth, Math.sin(angle_right) * strokeWidth);

	var target2 = trans2.transformCoords( [ bond.target.coord ])[0];

	var coords = transform.transformCoords( [ bond.source.coord, target1,
			target2 ]);

	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);
	bondPath.lineTo(coords[2].x, coords[2].y);

	this.graphics.drawPath(bondPath, bondStroke, bondFill, group);

}