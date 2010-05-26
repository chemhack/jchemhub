goog.provide('jchemhub.view.SingleBondRenderer');
goog.require('jchemhub.view.BondRenderer');

/**
 * Class to render a single bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.BondRenderer}
 */
jchemhub.view.SingleBondRenderer = function(parentEventTarget, graphics, opt_config) {
	jchemhub.view.BondRenderer.call(this, parentEventTarget, graphics, opt_config,
			jchemhub.view.SingleBondRenderer.defaultConfig);
};

goog.inherits(jchemhub.view.SingleBondRenderer, jchemhub.view.BondRenderer);

jchemhub.view.SingleBondRenderer.prototype.render = function(bond, transform,
		group) {
	jchemhub.view.SingleBondRenderer.superClass_.render.call(this, bond,
			transform, group);

	var bondPath = new goog.graphics.Path();
	var bondStroke = new goog.graphics.Stroke(
			this.config.get("bond").stroke.width,
			this.config.get("bond").stroke.color);
	var bondFill = null;

	var coords = transform.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);

	this.graphics.drawPath(bondPath, bondStroke, bondFill, group);

}