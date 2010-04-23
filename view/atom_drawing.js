goog.provide("jchemhub.view.AtomDrawing");
goog.require("goog.math.Coordinate");

/**
 * An atom graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing} parent Drawing object
 *            
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.AtomDrawing = function( x, y, symbol) {
	jchemhub.view.Drawing.call(this);
	this._coord = new goog.math.Coordinate(x,y);
	this._symbol = symbol;
};
goog.inherits(jchemhub.view.AtomDrawing, jchemhub.view.Drawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.AtomDrawing.prototype.render = function(){
	this.renderChildren();
};

/**
 * get atom coordinates as an array of goog.math.Coordinates
 */
jchemhub.view.AtomDrawing.prototype.getCoordinates=function(){
	return [this._coord];
};
