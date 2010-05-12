goog.provide("jchemhub.view.TripleBondDrawing");

/**
 * A triple bond graphical element in the reaction editor.
 * 
 * @param {jchemhub.model.Bond}
 *            bond
 * 
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.TripleBondDrawing = function(bond) {
	jchemhub.view.BondDrawing.call(this, bond);
};
goog.inherits(jchemhub.view.TripleBondDrawing, jchemhub.view.BondDrawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.TripleBondDrawing.prototype.render = function() {
	var strokeWidth = this.getConfig().get("bond").stroke.width;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.getConfig()
			.get("bond").stroke.color);
	var bondFill = null;

	var theta = this.getTheta();

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var bondWidth = goog.math.Coordinate.distance(this.bond.source.coord, this.bond.target.coord)/6;
	var transleft = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_left)
			* bondWidth, Math.sin(angle_left) * bondWidth, 0, 0, 0);

	var transright = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_right)
			* bondWidth, Math.sin(angle_right) * bondWidth, 0, 0, 0);

	var leftside = this.transformCoords(transleft, this.getCoords());
	var rightside = this.transformCoords(transright, this.getCoords());

	var coords = this.transformCoords(this.getTransform(), [ this.bond.source.coord, this.bond.target.coord, leftside[0],
			leftside[1], rightside[0], rightside[1] ]);

	var bondPath = new goog.graphics.Path();
	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);

	bondPath.moveTo(coords[2].x, coords[2].y);
	bondPath.lineTo(coords[3].x, coords[3].y);
	
	bondPath.moveTo(coords[4].x, coords[4].y);
	bondPath.lineTo(coords[5].x, coords[5].y);
	
	this._elements.push(this.getGraphics().drawPath(bondPath, bondStroke,
			bondFill, this.getGroup()));
	jchemhub.view.TripleBondDrawing.superClass_.render.call(this);

}