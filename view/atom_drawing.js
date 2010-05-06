goog.provide("jchemhub.view.AtomDrawing");
goog.require("goog.math.Coordinate");
goog.require("jchemhub.resource.Covalence");

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
	var atom_config = config.get(this.atom.symbol) ? config.get(this.atom.symbol) : config.get("atom");
	var font = new goog.graphics.Font(11, atom_config.fontName);
	var stroke = new goog.graphics.Stroke(atom_config.stroke.width, atom_config.stroke.color);
	var fill = new goog.graphics.SolidFill(atom_config.fill.color);
	var w = this.atom.symbol.length * 0.55 * font.size;
	var h = font.size;
	var coord = this.transformCoords(this.getTransform(), [this.atom.coord])[0];
	var drawn_symbol = this.compoundSymbol();
	if (drawn_symbol.symbol) this.getGraphics().drawEllipse(coord.x, coord.y, w, w,
		new goog.graphics.Stroke(1, config.get("background").color),
		new goog.graphics.SolidFill(config.get("background").color) );
	this.getGraphics().drawText(drawn_symbol.symbol, coord.x - w / 2, coord.y
			- h / 2, w, h, drawn_symbol.justification, null,
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
 * @param{goog.graphics.AffineTransform} trans
 * @return
 */
jchemhub.view.AtomDrawing.prototype.transformDrawing = function(trans) {
		var trans_coords = this.transformCoords(this.getTransform(), [this.atom.coord]);
		var new_coords = trans_coords;
		var new_base_coords = this.transformCoords(this.getTransform().createInverse(), new_coords);
		this.atom.coord = new_base_coords[0];
		jchemhub.view.BondDrawing.superClass_.transformDrawing(trans);
};

/**
 * return a compound symbol (e.g. NH, CH3), the plain symbol, or ""
 * 
 * @param{}
 * @return String
 */
jchemhub.view.AtomDrawing.prototype.compoundSymbol = function() {
	var retval = {symbol: this.atom.symbol, justification: 'center'};
	if (this.atom.countBonds() == 1) {
	// terminal atom may need compound atom name
		retval.symbol = this.atom.symbol;
		var hydrogen_count = this.hydrogenCount();
		switch  (hydrogen_count) {
		// could have H on left, depending on bond slope
		case 0:
			break;
		case 1:
			retval.symbol += 'H';
			break;
		default:
			retval.symbol += 'H' + hydrogen_count;
			break;
		}
		switch (this.atom.charge) {
		case 0:
			break;
		case 1:
			retval.symbol += '+';
			break;
		case -1:
			retval.symbol += '-';
			break;
		default:
			retval.symbol += this.atom.charge;
			break;
		}
		// could be 'right' depending on bond slope
		retval.justification = 'left';
	} else {
		if (this.atom.symbol == "C") retval.symbol = "";
	}
	return retval;
};

jchemhub.view.AtomDrawing.prototype.hydrogenCount = function() {
	var cov = jchemhub.resource.Covalence[this.atom.symbol];
	var totalBondOrder = 0;
	goog.array.forEach(this.atom.bonds.getValues(),function(element,index,array){
		//totalBondOrder+=element.bondType;//TODO not good enough, need to handle aromatic bonds.
		if (element instanceof jchemhub.model.SingleBond) {
			totalBondOrder += 1;
		} else if (element instanceof jchemhub.model.SingleBondUp) {
			totalBondOrder += 1;
		} else if (element instanceof jchemhub.model.SingleBondDown) {
			totalBondOrder += 1;
		} else if (element instanceof jchemhub.model.SingleBondUpOrDown) {
			totalBondOrder += 1;
		} else if (element instanceof jchemhub.model.DoubleBond) {
			totalBondOrder += 2;
		} else if (element instanceof jchemhub.model.TripleBond) {
			totalBondOrder += 3;
		} else if (element instanceof jchemhub.model.QuadrupleBond) {
			totalBondOrder += 4;
		}
	});
	var hydrogenCount = cov - totalBondOrder + this.atom.charge;
	return hydrogenCount;
};