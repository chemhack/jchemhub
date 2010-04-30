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
 * render this drawing and all its children
 */
jchemhub.view.DoubleBondDrawing.prototype.render = function() {

	var strokeWidth = this.getConfig().get("bond").stroke.width;
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.getConfig()
			.get("bond").stroke.color);
	var bondFill = null;

	var theta = this.getTheta();

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var bondWidth = strokeWidth / 15;
	var transleft = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_left)
			* bondWidth, Math.sin(angle_left) * bondWidth, 0, 0, 0);

	var transright = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_right)
			* bondWidth, Math.sin(angle_right) * bondWidth, 0, 0, 0);

	var leftside = this.transformCoords(transleft, this.getCoords());
	var rightside = this.transformCoords(transright, this.getCoords());

	var coords = this.transformCoords(this.getTransform(), [ leftside[0],
			leftside[1], rightside[0], rightside[1] ]);

	var bondPath1 = new goog.graphics.Path();
	bondPath1.moveTo(coords[0].x, coords[0].y);
	bondPath1.lineTo(coords[1].x, coords[1].y);
	this._elements.push(this.getGraphics().drawPath(bondPath1, bondStroke,
			bondFill, this.getGroup()));

	var bondPath2 = new goog.graphics.Path();
	bondPath2.moveTo(coords[2].x, coords[0].y);
	bondPath2.lineTo(coords[3].x, coords[1].y);
	this._elements.push(this.getGraphics().drawPath(bondPath2, bondStroke,
			bondFill, this.getGroup()));

	jchemhub.view.DoubleBondDrawing.superClass_.render.call(this);
}