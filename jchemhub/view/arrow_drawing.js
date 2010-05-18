goog.provide("jchemhub.view.ArrowDrawing");

/**
 * An arrow graphical element in the reaction editor.
 * 
 * @param {goog.math.Coordinate} center_coord The coordinates of the center of the arrow
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.ArrowDrawing = function(center_coord) {
	jchemhub.view.Drawing.call(this);
	var width = 1;
	var height = .25;
	this._nock = new goog.math.Coordinate(center_coord.x - width/2, center_coord.y);
	this._tip = new goog.math.Coordinate(this._nock.x + width, this._nock.y);
	this._head1 = new goog.math.Coordinate(this._tip.x - height, this._nock.y + height/2);
	this._head2 = new goog.math.Coordinate(this._head1.x, this._head1.y - height);

};
goog.inherits(jchemhub.view.ArrowDrawing, jchemhub.view.Drawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.ArrowDrawing.prototype.render = function() {
	var path = new goog.graphics.Path();
	var stroke = new goog.graphics.Stroke(
			this.getConfig().get("arrow").stroke.width, this.getConfig().get(
					"arrow").stroke.color);
	var fill = null;
	var coords = this.transformCoords(this.getTransform(), [ this._nock,
			this._tip, this._head1, this._head2 ]);

	path.moveTo(coords[0].x, coords[0].y);
	path.lineTo(coords[1].x, coords[1].y);
	path.lineTo(coords[2].x, coords[2].y);
	path.moveTo(coords[1].x, coords[1].y);
	path.lineTo(coords[3].x, coords[3].y);

	this.getGraphics().drawPath(path, stroke, fill, this.getGroup());

};

/**
 * get bounding box size
 * 
 * @return {goog.math.Size}
 */
jchemhub.view.ArrowDrawing.prototype.getCoords = function() {
	return [ this._nock, this._tip, this._head1, this._head2 ];
}

jchemhub.view.Drawing.prototype.updateTransformedCoords = function() {
};
