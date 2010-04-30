goog.provide("jchemhub.view.AtomDrawing");
goog.require("goog.math.Coordinate");

/**
 * An atom graphical element in the reaction editor.
 * 
 * @param {jchemhub.model.Atom} atom
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.AtomDrawing = function(atom) {
	jchemhub.view.Drawing.call(this);
	this.atom = atom;
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
	var w = this.atom.symbol.length * 0.55 * font.size;
	var h = font.size;
	var coord = this.transformCoords(this.getTransform(), [this.atom.coord])[0];
	this.getGraphics().drawText(this.atom.symbol, coord.x - w / 2, coord.y
			- h / 2, w, h, 'center', null,
			font,
			stroke, fill, this.getGroup());

};

/**
 * @override
 */
jchemhub.view.AtomDrawing.prototype.getCoords = function() {
	return [ this.atom.coord ];
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
			new goog.math.Coordinate(this.atom.coord.x - r, this.atom.coord.y - r),
			new goog.math.Coordinate(this.atom.coord.x + r, this.atom.coord.y + r) ]);
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
		var trans_coords = this.transformCoords(this.getTransform(), [this.atom.coord]);
		var new_coords = trans_coords;
		var new_base_coords = this.transformCoords(this.getTransform().createInverse(), new_coords);
		this.atom.coord = new_base_coords[0];
		jchemhub.view.BondDrawing.superClass_.transformDrawing(trans);
	}
