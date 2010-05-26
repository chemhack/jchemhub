goog.provide('jchemhub.view.QuadrupleBondRenderer');
goog.require('jchemhub.view.BondRenderer');

/**
 * Class to render a quadruple bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.BondRenderer}
 */
jchemhub.view.QuadrupleBondRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.BondRenderer.call(this, controller, graphics, opt_config,
			jchemhub.view.QuadrupleBondRenderer.defaultConfig);

}
goog.inherits(jchemhub.view.QuadrupleBondRenderer, jchemhub.view.BondRenderer);

jchemhub.view.QuadrupleBondRenderer.prototype.render = function(bond,
		transform, group) {
	jchemhub.view.QuadrupleBondRenderer.superClass_.render.call(this, bond,
			transform, group);
	var strokeWidth = this.config.get("bond").stroke.width;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.config
			.get("bond").stroke.color);
	var bondFill = null;

	var theta = jchemhub.view.BondRenderer.getTheta(bond);

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var bondWidth = goog.math.Coordinate.distance(bond.source.coord,
			bond.target.coord) / 6;
	var transleft1 = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* bondWidth / 3, Math.sin(angle_left) * bondWidth / 3);

	var transright1 = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* bondWidth / 3, Math.sin(angle_right) * bondWidth / 3);
	var transleft2 = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* bondWidth, Math.sin(angle_left) * bondWidth);

	var transright2 = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* bondWidth, Math.sin(angle_right) * bondWidth);

	var leftside1 = transleft1.transformCoords( [ bond.source.coord,
			bond.target.coord ]);
	var rightside1 = transright1.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	var leftside2 = transleft2.transformCoords( [ bond.source.coord,
			bond.target.coord ]);
	var rightside2 = transright2.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	var coords = transform.transformCoords( [ leftside1[0], leftside1[1],
			rightside1[0], rightside1[1], leftside2[0], leftside2[1],
			rightside2[0], rightside2[1] ]);

	var bondPath = new goog.graphics.Path();
	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);

	bondPath.moveTo(coords[2].x, coords[2].y);
	bondPath.lineTo(coords[3].x, coords[3].y);

	 bondPath.moveTo(coords[4].x, coords[4].y);
	 bondPath.lineTo(coords[5].x, coords[5].y);
	 
	 bondPath.moveTo(coords[6].x, coords[6].y);
	 bondPath.lineTo(coords[7].x, coords[7].y);

	this.graphics.drawPath(bondPath, bondStroke, bondFill, group);
}