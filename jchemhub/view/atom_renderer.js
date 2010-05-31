goog.provide('jchemhub.view.AtomRenderer');

goog.require('jchemhub.view.Renderer');
goog.require('goog.debug.Logger');

/**
 * Class to render an atom object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.AtomRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.Renderer.call(this, controller, graphics, opt_config,
			jchemhub.view.AtomRenderer.defaultConfig);
}
goog.inherits(jchemhub.view.AtomRenderer, jchemhub.view.Renderer);
/**
 * 
 * @param {jchemhub.model.Atom} atom
 * @param {jchemhub.graphics.AffineTransform} transform
 * @return {goog.graphics.GroupElement}
 */
jchemhub.view.AtomRenderer.prototype.render = function(atom, transform) {
	this.transform = transform;

	var atom_config = this.config.get("atom");
	var color = this.config.get(atom.symbol) ? this.config.get(atom.symbol).color
			: atom_config.color;

	var scale = transform.getScaleX();

	var font = new goog.graphics.Font(scale / 1.8, atom_config.fontName);
	var stroke = new goog.graphics.Stroke(atom_config.stroke.width, color);
	var fill = new goog.graphics.SolidFill(color);

	var point = transform.transformCoords( [ atom.coord ])[0];
	var symbol = this.compoundSymbol(atom);
	var graphics = this.graphics;
	var w = symbol.text.length * 0.55 * font.size;
	var h = font.size;
	var group = graphics.createGroup();
	
	if (symbol.text) {
		group.atomLabelBackground = graphics.drawEllipse(point.x, point.y,
				h * 0.7, h * 0.7, new goog.graphics.Stroke(1, this.config
						.get("background").color), new goog.graphics.SolidFill(
						this.config.get("background").color), group);

		graphics.drawText(symbol.text, point.x - w / 2, point.y - h / 2, w, h,
				symbol.justification, null, font, stroke, fill, group);
		if (symbol.justification == 'left') {
			if (symbol.subscript || symbol.superscript) {
				var subSize = this.config.get("subscriptSize");
				if (symbol.subscript) {
					graphics.drawText(symbol.subscript, point.x + w * 0.9,
							point.y, subSize, subSize, 'center', null, font,
							stroke, fill, group);
				}
				if (symbol.superscript) {
					graphics.drawText(symbol.superscript, point.x + w, point.y
							- h * 0.8, subSize, subSize, 'center', null, font,
							stroke, fill, group);
				}
			}
		} else if (symbol.justification == 'right') {
			if (symbol.subscript || symbol.superscript) {
				var subSize = this.config.get("subscriptSize");
				if (symbol.subscript) {
					graphics.drawText('H', point.x - w * 3, point.y - h / 2, w,
							h, 'center', null, font, stroke, fill, group);
					graphics.drawText(symbol.subscript, point.x - w * 1.8,
							point.y, subSize, subSize, 'center', null, font,
							stroke, fill, group);
				}
				if (symbol.superscript) {
					graphics.drawText(symbol.superscript, point.x + w, point.y
							- h * 0.8, subSize, subSize, 'center', null, font,
							stroke, fill, group);
				}
			}
		}
	}
	group.addEventListener(goog.events.EventType.MOUSEOVER, 
		   goog.bind(this.controller.handleMouseOver, this.controller, atom)); 
	group.addEventListener(goog.events.EventType.MOUSEOUT, 
			   goog.bind(this.controller.handleMouseOut, this.controller, atom)); 

	return group;

};

/**
 * return a compound symbol (e.g. NH, CH3), the plain symbol, or ""
 * 
 * @param{jchemhun.model.Atom} atom
 * @return {String}
 */
jchemhub.view.AtomRenderer.prototype.compoundSymbol = function(atom) {
	var retval = {
		text : "",
		justification : 'center',
		superscript : '',
		subscript : ''
	};
	if (atom.symbol != "C" || atom.countBonds() == 1) {
		// terminal atom may need compound atom name
		var hydrogen_count = atom.hydrogenCount();
		if (hydrogen_count == 0) {
			retval.text = atom.symbol;
			// could have H on left, depending on bond slope
		} else {
			bond_direction = jchemhub.view.AtomRenderer.bondDirection(atom);
			var justification = 'center';
			if (bond_direction == "SW" || bond_direction == "W"
					|| bond_direction == "NW") {
				justification = 'right';
				if (hydrogen_count == 1)
					retval.text = 'H';
				retval.text += atom.symbol;
			} else {
				justification = 'left';
				retval.text = atom.symbol + 'H';
			}
			if (hydrogen_count > 1)
				retval.subscript = String(hydrogen_count);
		}
		if (atom.charge) {
			if (atom.charge > 1) {
				retval.superscript += '+' + atom.charge;
			} else if (atom.charge < -1) {
				retval.superscript += atom.charge;
			} else if (atom.charge == -1) {
				retval.superscript = '-';
			} else if (atom.charge == 1) {
				retval.superscript = '+';
			}
		}

	} else {
		retval.text = "";
	}
	retval.justification = justification;
	return retval;
};

/**
 * return an angle between 0 and 360 at which the i-th bond to this atom is
 * drawn
 * 
 * @param{integer} i-th bond to this atom
 * @return number
 */
jchemhub.view.AtomRenderer.bondOrientation = function(atom, i) {
	var bond = atom.bonds.getValues()[i];
	var target = bond.target.coord;
	var source = bond.source.coord;

	var dy = target.y - source.y;
	var dx = target.x - source.x;
	if (atom == bond.source) {
		dx = -dx;
		dy = -dy;
	}
	var angle = Math.atan2(dy, dx) * 180 / Math.PI;
	if (angle < 0)
		angle = 360 + angle; // now angle is 0 - 360
	return angle;
};

/**
 * returns the compass direction toward which to draw H atoms N NW NE W E SW SE
 * S
 * 
 * @param{jchemhub.model.Atom} atom
 * @return{String}
 */
jchemhub.view.AtomRenderer.bondDirection = function(atom) {
	var nbonds = atom.bonds.getCount();
	var angle = jchemhub.view.AtomRenderer.bondOrientation(atom, 0); // suffices
	// for
	// terminal
	// atoms
	if (nbonds > 1) {
		// find most open direction to show H atom
		for ( var i = 1; i < nbonds; ++i) {
			angle += jchemhub.view.AtomRenderer.bondOrientation(atom, i);
		}
		angle = (angle / nbonds) % 360;
	}

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

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.AtomRenderer.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.AtomRenderer');

/**
 * A default configuration for renderer
 */
jchemhub.view.AtomRenderer.defaultConfig = {
	atom : {
		color : '#FF9999',
		diameter : .05,
		stroke : {
			width : 1
		},
		fontName : "Arial"
	},
	background : {
		color : '#F0FFF0'
	},
	margin : 20,
	subscriptSize : 5,
	N : {
		color : 'blue'
	},
	O : {

		color : 'red'

	},
	S : {

		color : 'yellow'

	},
	P : {

		color : 'orange'

	},
	Cl : {

		color : 'green'

	},
	F : {

		color : 'green'

	},
	Br : {

		color : 'DarkRed'

	},
	I : {

		color : 'purple'

	},
	C : {

		color : 'black'

	},
	H : {

		color : 'white'
	}
};