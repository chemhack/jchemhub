goog.provide("jchemhub.view.SingleBondDownDrawing");
goog.require("jchemhub.view.BondDrawing");

/**
 * A single bond stereo down graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.BondDrawing}
 */
jchemhub.view.SingleBondDownDrawing = function(x0, y0, x1, y1) {
	jchemhub.view.BondDrawing.call(this, x0, y0, x1, y1);
};
goog.inherits(jchemhub.view.SingleBondDownDrawing, jchemhub.view.BondDrawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.SingleBondDownDrawing.prototype.render = function() {
	
	var path = new goog.graphics.Path();
	var width = this.getConfig().get("bond").stroke.width/10;
	var theta = this._line.getTheta();

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var transleft = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_left)
			* width, Math.sin(angle_left) * width, 0, 0, 0);

	var transright = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_right)
			* width, Math.sin(angle_right) * width, 0, 0, 0);

	var leftside = this.transformCoords(transleft, [ this._line.getStart(),
			this._line.getEnd() ]);
	var rightside = this.transformCoords(transright, [ this._line.getStart(),
			this._line.getEnd() ]);

	var coords = this.transformCoords(this.getTransform(), [ leftside[0],
			leftside[1], rightside[0], rightside[1] ]);

	var stroke = new goog.graphics.Stroke(
			this.getConfig().get("bond").stroke.width, this.getConfig().get(
					"bond").stroke.color);
	var fill = null;

	
    for(var j=1,lines=6;j<lines;j++){
    	path.moveTo(coords[0].x + (coords[1].x - coords[0].x) * j/lines, coords[0].y + (coords[1].y - coords[0].y) * j/lines);
    	path.lineTo(coords[2].x + (coords[3].x - coords[2].x) * j/lines, coords[2].y + (coords[3].y - coords[2].y) * j/lines);
    }

	this._elements.push(this.getGraphics().drawPath(path, stroke,
			fill, this.getGroup()));
	jchemhub.view.SingleBondDownDrawing.superClass_.render.call(this);
}