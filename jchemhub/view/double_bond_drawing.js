goog.provide("jchemhub.view.DoubleBondDrawing");
goog.require("jchemhub.view.BondDrawing");
goog.require("goog.math.Line");

/**
 * A double bond graphical element in the reaction editor.
 * 
 * @param {jchemhub.model.Bond}
 *            bond
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.DoubleBondDrawing = function(bond) {
	jchemhub.view.BondDrawing.call(this, bond);
};
goog.inherits(jchemhub.view.DoubleBondDrawing, jchemhub.view.BondDrawing);

/**
 * 
 * @return{jchemhub.ring.Ring} first ring that contains this bond
 */
jchemhub.view.DoubleBondDrawing.prototype.getFirstRing = function() {
	return goog.array.find(this.getParent().molecule.getRings(),
			function(ring) {
				return goog.array.contains(ring.bonds, this.bond);
			}, this);
}

/**
 * render this drawing and all its children
 */
jchemhub.view.DoubleBondDrawing.prototype.render = function() {
	var strokeWidth = this.getConfig().get("bond").stroke.width;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.getConfig()
			.get("bond").stroke.color);
	var bondFill = null;

	var ring = this.getFirstRing();

	if (ring) {

		var center = ring.ringCenter;
		var source_offset = goog.math.Coordinate.difference(center,
				this.bond.source.coord);
		var inner_line_source = goog.math.Coordinate.sum(
				new goog.math.Coordinate(source_offset.x / 5,
						source_offset.y / 5), this.bond.source.coord);
		var target_offset = goog.math.Coordinate.difference(center,
				this.bond.target.coord);
		var inner_line_target = goog.math.Coordinate.sum(
				new goog.math.Coordinate(target_offset.x / 5,
						target_offset.y / 5), this.bond.target.coord);

		var coords = this.transformCoords(this.getTransform(), [
				this.bond.source.coord, this.bond.target.coord,
				inner_line_source, inner_line_target ]);
		var bondPath = new goog.graphics.Path();
		bondPath.moveTo(coords[0].x, coords[0].y);
		bondPath.lineTo(coords[1].x, coords[1].y);
		bondPath.moveTo(coords[2].x, coords[2].y);
		bondPath.lineTo(coords[3].x, coords[3].y);

		this._elements.push(this.getGraphics().drawPath(bondPath, bondStroke,
				bondFill, this.getGroup()));
	} else {
		var theta = this.getTheta();

		var angle_left = theta + (Math.PI / 2);
		var angle_right = theta - (Math.PI / 2);

		var bondWidth = goog.math.Coordinate.distance(this.bond.source.coord, this.bond.target.coord)/12;
		var transleft = goog.graphics.AffineTransform.getTranslateInstance(Math
				.cos(angle_left)
				* bondWidth, Math.sin(angle_left) * bondWidth, 0, 0, 0);

		var transright = goog.graphics.AffineTransform.getTranslateInstance(
				Math.cos(angle_right) * bondWidth, Math.sin(angle_right)
						* bondWidth, 0, 0, 0);

		var leftside = this.transformCoords(transleft, this.getCoords());
		var rightside = this.transformCoords(transright, this.getCoords());

		var coords = this.transformCoords(this.getTransform(), [ leftside[0],
				leftside[1], rightside[0], rightside[1] ]);

		var bondPath = new goog.graphics.Path();
		bondPath.moveTo(coords[0].x, coords[0].y);
		bondPath.lineTo(coords[1].x, coords[1].y);

		bondPath.moveTo(coords[2].x, coords[2].y);
		bondPath.lineTo(coords[3].x, coords[3].y);

		this._elements.push(this.getGraphics().drawPath(bondPath, bondStroke,
				bondFill, this.getGroup()));
	}
	jchemhub.view.DoubleBondDrawing.superClass_.render.call(this);
}