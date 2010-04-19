goog.provide("chem.view.AtomDrawing");
goog.require("goog.math.Coordinate");

/**
 * An atom graphical element in the reaction editor.
 * 
 * @param {chem.view.Drawing} parent Drawing object
 *            
 * @constructor
 * @extends {chem.view.Drawing}
 */
chem.view.AtomDrawing = function( x, y, symbol) {
	chem.view.Drawing.call(this);
	this._coord = new goog.math.Coordinate(x,y);
	this._symbol = symbol;
};
goog.inherits(chem.view.AtomDrawing, chem.view.Drawing);

/**
 * render this drawing and all its children
 */
chem.view.AtomDrawing.prototype.render = function(){
	this.renderChildren();
};

/**
 * get atom coordinates as an array of goog.math.Coordinates
 */
chem.view.AtomDrawing.prototype.getCoordinates=function(){
	return [this._coord];
};
