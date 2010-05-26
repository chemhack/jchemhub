goog.provide('jchemhub.view.SingleUpOrDownBondRenderer');
goog.require('jchemhub.view.BondRenderer');

/**
 * Class to render a Single-UpOrDown bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.BondRenderer}
 */
jchemhub.view.SingleUpOrDownBondRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.BondRenderer.call(this, controller, graphics, opt_config,
			jchemhub.view.SingleUpOrDownBondRenderer.defaultConfig);

}
goog.inherits(jchemhub.view.SingleUpOrDownBondRenderer,
		jchemhub.view.BondRenderer);

jchemhub.view.SingleUpOrDownBondRenderer.prototype.render = function(bond,
		transform, group) {
	jchemhub.view.SingleUpOrDownBondRenderer.superClass_.render.call(this,
			bond, transform, group);

	var path = new goog.graphics.Path();
	var width = this.config.get("bond").stroke.width / 10;
	var theta = jchemhub.view.BondRenderer.getTheta(bond);

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var transleft = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* width, Math.sin(angle_left) * width);

	var transright = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* width, Math.sin(angle_right) * width);

	var leftside = transleft.transformCoords( [bond.source.coord, bond.target.coord]);
	var rightside = transright.transformCoords([bond.source.coord, bond.target.coord]);

	var coords = transform.transformCoords( [ leftside[0],
			leftside[1], rightside[0], rightside[1] ]);

	var stroke = new goog.graphics.Stroke(
			this.config.get("bond").stroke.width, this.config.get(
					"bond").stroke.color);
	var fill = null;

	path.moveTo(coords[0].x, coords[0].y);
	for ( var j = 1, lines = 10; j < lines; j++) {
		if (j % 2) {
			path.lineTo(coords[0].x + (coords[1].x - coords[0].x) * j / lines,
					coords[0].y + (coords[1].y - coords[0].y) * j / lines);
		} else {
			path.lineTo(coords[2].x + (coords[3].x - coords[2].x) * j / lines,
					coords[2].y + (coords[3].y - coords[2].y) * j / lines);
		}
	}

	this.graphics.drawPath(path, stroke, fill, group);

}