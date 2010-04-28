goog.provide("jchemhub.view.AtomDrawing");
goog.require("goog.math.Coordinate");

/**
 * An atom graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.AtomDrawing = function(x, y, symbol) {
	jchemhub.view.Drawing.call(this);
	this._coord = new goog.math.Coordinate(x, y);
	this._symbol = symbol;
	this._trans_coord = null;
};
goog.inherits(jchemhub.view.AtomDrawing, jchemhub.view.Drawing);

/**
 * @override render atom
 */
jchemhub.view.AtomDrawing.prototype.render = function() {
	var config = this.getConfig();
	var font = new goog.graphics.Font(10, config.get("atom").fontName);
	var stroke = new goog.graphics.Stroke(config.get("atom").stroke.width,
			config.get("atom").stroke.color);
	var fill = new goog.graphics.SolidFill(config.get("atom").fill.color);
	var w = this._symbol.length * 0.55 * font.size;
	var h = font.size;
	var coord = this.transformCoords(this.getTransform(), [this._coord])[0];
	this.getGraphics().drawText(this._symbol, coord.x - w / 2, coord.y
			- h / 2, w, h, 'center', null,
			font,
			stroke, fill, this.getGroup());

};

/**
 * @override
 */
jchemhub.view.AtomDrawing.prototype.getCoords = function() {
	return [ this._coord ];
};

/**
 * returns bounding box of atom point plus its radius
 * 
 * @override
 * 
 * @return {goog.math.Box}
 */
jchemhub.view.AtomDrawing.prototype.getBoundingBox = function() {
	var r = this.getConfig().get("atom").diameter / 2;

	return goog.math.Box.boundingBox.apply(null, [
			new goog.math.Coordinate(this._coord.x - r, this._coord.y - r),
			new goog.math.Coordinate(this._coord.x + r, this._coord.y + r) ]);
};

jchemhub.view.AtomDrawing.prototype.updateTransformedCoords = function() {
	this._trans_coord = this.transformCoords(this.getTransform(), [ this
			.getCoordinates() ])[0];
};

/**
 * transform drawing and update base coords
 * 
 * @param trans
 * @return
 */
jchemhub.view.AtomDrawing.prototype.transformDrawing = function(trans) {
		var trans_coords = this.transformCoords(this.getTransform(), [this._coord]);
		var new_coords = trans_coords;
		var new_base_coords = this.transformCoords(this.getTransform().createInverse(), new_coords);
		this._coord = new_base_coords[0];
		jchemhub.view.BondDrawing.superClass_.transformDrawing(trans);
	}
