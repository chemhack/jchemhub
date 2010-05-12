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
	var scale = this.getTransform().getScaleX();
	console.log(scale);
	var font = new goog.graphics.Font(scale/1.8, atom_config.fontName);
	var stroke = new goog.graphics.Stroke(atom_config.stroke.width, atom_config.stroke.color);
	var fill = new goog.graphics.SolidFill(atom_config.fill.color);

	var point = this.transformCoords(this.getTransform(), [this.atom.coord])[0];
	var symbol = this.compoundSymbol();
	var graphics = this.getGraphics();
	var group = this.getGroup();
	var w = symbol.text.length * 0.55 * font.size;
	var h = font.size;
	if (symbol.text) {
		group.atomLabelBackground = graphics.drawEllipse(point.x, point.y, h*0.7, h*0.7,
			new goog.graphics.Stroke(1, config.get("background").color),
			new goog.graphics.SolidFill(config.get("background").color), group );
			
		graphics.drawText(symbol.text, point.x - w / 2, point.y - h / 2, w, h, symbol.justification, null, font, stroke, fill, group);
        if (symbol.justification == 'left') {
        	if(symbol.subscript || symbol.superscript){
				var subSize = config.get("subscriptSize");
				if(symbol.subscript){
 					graphics.drawText(symbol.subscript,   point.x + w, point.y , subSize, subSize, 'center', null, font, stroke, fill, group);
				}
				if(symbol.superscript){
					graphics.drawText(symbol.superscript, point.x + w, point.y-h*0.8 , subSize, subSize, 'center', null, font, stroke, fill, group);
				}
			}
        } else if (symbol.justification == 'right') {
			if(symbol.subscript || symbol.superscript){
				var subSize = config.get("subscriptSize");
				if(symbol.subscript){
 					graphics.drawText(symbol.subscript,   point.x - w*0.2, point.y , subSize, subSize, 'center', null, font, stroke, fill, group);
				}
				if(symbol.superscript){
					graphics.drawText(symbol.superscript, point.x + w, point.y-h*0.8 , subSize, subSize, 'center', null, font, stroke, fill, group);
				}
			}
		}
	}

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
	var retval = {text: this.atom.symbol, justification: 'center', superscript: '', subscript: ''};
	if (this.atom.countBonds() == 1) {
	// terminal atom may need compound atom name
		var hydrogen_count = this.atom.hydrogenCount();
		if  (hydrogen_count == 0) {
			retval.text = this.atom.symbol;
		// could have H on left, depending on bond slope
		} else {
			bond_direction = this.bondDirection();
			var justification = 'center';
			if (bond_direction == "SW" || bond_direction == "W" || bond_direction == "NW") {
				justification = 'right';
				retval.text = 'H';
				if (hydrogen_count > 1) retval.text += ' ';
				retval.text += this.atom.symbol;	
			} else {
				justification = 'left';
				retval.text = this.atom.symbol + 'H';
			}
			if (hydrogen_count > 1) retval.subscript = String(hydrogen_count);
		}
		if (this.atom.charge) {
			if (this.atom.charge > 1) {
				retval.superscript += '+' + this.atom.charge;
			} else if (this.atom.charge < -1) {
				retval.superscript += this.atom.charge;
			} else if (this.atom.charge == -1) {
				retval.superscript = '-';
			} else if (this.atom.charge == 1) {
				retval.superscript = '+';
			}
		}

	} else {
		if (this.atom.symbol == "C") retval.text = "";
	}
	retval.justification = justification;
	return retval;
};

jchemhub.view.AtomDrawing.prototype.bondDirection = function() {
// returns the bond compass direction
//     N
//  NW   NE
// W       E
//  SW   SE
//     S
	var bond =  this.atom.bonds.getValues()[0];
	var target = bond.target.coord;
	var source = bond.source.coord;
	//console.log("bond" + String(this.atom == bond.target));
	var dy = target.y - source.y;
	var dx = target.x - source.x;
	if (this.atom == bond.source) {
		dx = -dx;
		dy = -dy;
	}
	var angle = Math.atan2(dy, dx) * 180/Math.PI;
	if (angle < 0) angle = 360 + angle;  // now angle is 0 - 360
	//console.log(angle);
	if (angle > 350 || angle <= 10) {
		return "E";
	} else if (angle > 10 && angle <= 80) {
		return "SE";
	} else if (angle > 80 && angle <= 100) {
		return "S";
	} else if (angle > 100 && angle <= 170) {
		return "SW";
	} else if (angle > 170 && angle <= 190) {
		return "W";
	} else if (angle > 190 && angle <= 260) {
		return "NW";
	} else if (angle > 260 && angle <= 280) {
		return "N";
	} else {
		return "NE";
	}
};