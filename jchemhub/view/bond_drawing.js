goog.provide("jchemhub.view.BondDrawing");
goog.require("jchemhub.view.Drawing");
goog.require("jchemhub.math.Line");
goog.require("goog.events");
goog.require("goog.fx.Dragger");

/**
 * A bond graphical element in the reaction editor.
 * 
 * @param {jchemhub.model.Bond}
 *            bond
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.BondDrawing = function(bond) {
	jchemhub.view.Drawing.call(this);
	this.bond = bond;
//
//	this.addEventListener(goog.events.EventType.MOUSEOVER, this._highlightOn);
//	this.addEventListener(goog.events.EventType.MOUSEOUT, this._highlightOff);
	// this.addEventListener(goog.events.EventType.MOUSEDOWN, this.drag);
};
goog.inherits(jchemhub.view.BondDrawing, jchemhub.view.Drawing);

/**
 * @override
 */
jchemhub.view.BondDrawing.prototype.getCoords = function() {
	return [ this.bond.source.coord, this.bond.target.coord ];
};

/**
 * returns bounding box of bond line plus
 * 
 * @override
 * 
 * @return {goog.math.Box}
 */
jchemhub.view.BondDrawing.prototype.getBoundingBox = function() {
	var r = this.getConfig().get("bond").stroke.width / 2;

	return goog.math.Box.boundingBox.apply(null, [
			new goog.math.Coordinate(this.bond.source.coord.x - r,
					this.bond.source.coord.y - r),
			new goog.math.Coordinate(this.bond.target.coord.x + r,
					this.bond.target.coord.y + r) ]);
};

//jchemhub.view.BondDrawing.prototype.transformDrawing = function(trans) {
//	var trans_coords = this.transformCoords(this.getTransform(),this.getCoords());
//	// var new_coords = this.transformCoords(trans, trans_coords);
//	var new_coords = trans_coords;
//	var new_base_coords = this.transformCoords(this.getTransform()
//			.createInverse(), new_coords);
//	this.bond.source.coord = new_base_coords[0];
//	this.bond.target.coord = new_base_coords[1];
//	jchemhub.view.BondDrawing.superClass_.transformDrawing(trans);
//}

/**
 *
 * @return{number} bond angle of elevation
 */
jchemhub.view.BondDrawing.prototype.getTheta = function() {
	return new jchemhub.math.Line(this.bond.source.coord,
			this.bond.target.coord).getTheta();
}

/**
 * render box to surround BondDrawing with width equal to highlight radius
 */
jchemhub.view.BondDrawing.prototype.render = function() {
	// render bond box path
	var fill = new goog.graphics.SolidFill('red', 0.001);
	var stroke = null;
	var radius = this.getConfig().get("highlight").radius * 3;
	var theta = this.getTheta();

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var transleft = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_left)
			* radius, Math.sin(angle_left) * radius, 0, 0, 0);

	var transright = goog.graphics.AffineTransform.getTranslateInstance(Math
			.cos(angle_right)
			* radius, Math.sin(angle_right) * radius, 0, 0, 0);

	var leftside = this.transformCoords(transleft, this.getCoords());
	var rightside = this.transformCoords(transright, this.getCoords());

	var boxCoords = this.transformCoords(this.getTransform(), [ leftside[0],
			leftside[1], rightside[0], rightside[1] ]);

	bondBoxPath = new goog.graphics.Path();
	bondBoxPath.moveTo(boxCoords[0].x, boxCoords[0].y);
	bondBoxPath.lineTo(boxCoords[2].x, boxCoords[2].y);
	bondBoxPath.lineTo(boxCoords[3].x, boxCoords[3].y);
	bondBoxPath.lineTo(boxCoords[1].x, boxCoords[1].y);
	bondBoxPath.close();

	this.getGraphics().drawPath(bondBoxPath, stroke, fill, this.getGroup());
	this.getGroup().getElement()._parentGroup = this.getGroup();

};

/**
 * turn on highlighting
 */
jchemhub.view.BondDrawing.prototype._highlightOn = function(e) {
	var drawing = e.currentTarget;
	var config = drawing.getConfig();
	var strokeWidth = config.get("bond").stroke.width;
	var stroke = new goog.graphics.Stroke(strokeWidth,
			config.get("highlight").color);
	var fill = null
	var radius = config.get("highlight").radius
			* drawing.getTransform().getScaleX();
	var theta = this.getTheta();
	var angle = theta - Math.PI/2;

	var arcExtent;
	if (theta <= 0) {
		arcExtent = (drawing.bond.source.coord.y <= drawing.bond.target.coord.y) ? -180 : 180;
	} else {
		arcExtent = (drawing.bond.source.coord.y > drawing.bond.target.coord.y) ? 180 : -180;
	}
	var coords = drawing.transformCoords(drawing.getTransform(), drawing.getCoords());
	var path = new goog.graphics.Path();
	path.arc(coords[0].x, coords[0].y, radius, radius, angle, arcExtent);
	path.arc(coords[1].x, coords[1].y, radius, radius, angle, -arcExtent);

	if (!drawing.bondHighlightGroup) {
		drawing.bondHighlightGroup = drawing.getGraphics().createGroup();
	}
	drawing.getGraphics().drawPath(path, stroke, fill, drawing.bondHighlightGroup);

};
/**
 * turn off highlighting
 */
jchemhub.view.BondDrawing.prototype._highlightOff = function(e) {
	if (e.currentTarget.bondHighlightGroup) {
		e.currentTarget.bondHighlightGroup.clear();
	}
};

jchemhub.view.BondDrawing.prototype.drag = function(e) {
	var bond = e.currentTarget;
	var d = new goog.fx.Dragger(bond.getGroup().getElement());
	d.prevX = e.clientX;
	d.prevY = e.clientY;
	d.bond = bond;
	d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {

		var trans = d.bond.getGroup().getTransform();
		var newX = e.clientX - d.prevX + trans.getTranslateX();
		var newY = e.clientY - d.prevY + trans.getTranslateY();
		bond.getGroup().setTransformation(newX, newY, 0, 0, 0);

		d.prevX = e.clientX;
		d.prevY = e.clientY;

	});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
		console.log('finish');

		d.dispose();
	});
	d.startDrag(e);
};
