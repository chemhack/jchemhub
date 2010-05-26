goog.provide('jchemhub.view.DoubleBondRenderer');
goog.require('jchemhub.view.BondRenderer');

/**
 * Class to render a double bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.BondRenderer}
 */
jchemhub.view.DoubleBondRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.BondRenderer.call(this, controller, graphics, opt_config,
			jchemhub.view.DoubleBondRenderer.defaultConfig);

}
goog.inherits(jchemhub.view.DoubleBondRenderer, jchemhub.view.BondRenderer);

jchemhub.view.DoubleBondRenderer.prototype.render = function(bond, transform,
		group) {
	jchemhub.view.DoubleBondRenderer.superClass_.render.call(this, bond,
			transform, group);

	var strokeWidth = this.config.get("bond").stroke.width;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.config
			.get("bond").stroke.color);
	var bondFill = null;

	var ring = jchemhub.view.DoubleBondRenderer.getFirstRing(bond);

	if (ring) {

		var center = ring.ringCenter;
		var source_offset = goog.math.Coordinate.difference(center,
				bond.source.coord);
		var inner_line_source = goog.math.Coordinate.sum(
				new goog.math.Coordinate(source_offset.x / 5,
						source_offset.y / 5), bond.source.coord);
		var target_offset = goog.math.Coordinate.difference(center,
				bond.target.coord);
		var inner_line_target = goog.math.Coordinate.sum(
				new goog.math.Coordinate(target_offset.x / 5,
						target_offset.y / 5), bond.target.coord);

		var coords = transform.transformCoords( [
				bond.source.coord, bond.target.coord,
				inner_line_source, inner_line_target ]);
		var bondPath = new goog.graphics.Path();
		bondPath.moveTo(coords[0].x, coords[0].y);
		bondPath.lineTo(coords[1].x, coords[1].y);
		bondPath.moveTo(coords[2].x, coords[2].y);
		bondPath.lineTo(coords[3].x, coords[3].y);

		this.graphics.drawPath(bondPath, bondStroke, bondFill, group);
	} else {
		var theta = jchemhub.view.BondRenderer.getTheta(bond);

		var angle_left = theta + (Math.PI / 2);
		var angle_right = theta - (Math.PI / 2);

		var bondWidth = goog.math.Coordinate.distance(bond.source.coord,
				bond.target.coord) / 12;
		var transleft = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
				.cos(angle_left)
				* bondWidth, Math.sin(angle_left) * bondWidth);

		var transright = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
				.cos(angle_right)
				* bondWidth, Math.sin(angle_right) * bondWidth);

		var leftside = transleft.transformCoords( [ bond.source.coord,
				bond.target.coord ]);
		var rightside = transright.transformCoords( [ bond.source.coord,
				bond.target.coord ]);

		var coords = transform.transformCoords( [ leftside[0], leftside[1],
				rightside[0], rightside[1] ]);

		var bondPath = new goog.graphics.Path();
		bondPath.moveTo(coords[0].x, coords[0].y);
		bondPath.lineTo(coords[1].x, coords[1].y);

		bondPath.moveTo(coords[2].x, coords[2].y);
		bondPath.lineTo(coords[3].x, coords[3].y);

		this.graphics.drawPath(bondPath, bondStroke, bondFill, group);
	}

};

/**
 * 
 * @return{jchemhub.ring.Ring} first ring that contains this bond
 */
jchemhub.view.DoubleBondRenderer.getFirstRing = function(bond) {
	return goog.array.find(bond.molecule.getRings(), function(ring) {
		return goog.array.contains(ring.bonds, this);
	}, bond);
}
