goog.provide("jchemhub.math.Line");
goog.require("goog.math.Line");

/**
 * representation of a line
 * 
 * @param {goog.math.Coordinate} coord0 start point
 * @param {goog.math.Coordinate} coord1 end point
 * 
 * @constructor
 * @extends {goog.math.Line}
 */

jchemhub.math.Line = function(coord0, coord1) {
	goog.math.Line.call(this, coord0.x, coord0.y, coord1.x, coord1.y);
	
};
goog.inherits(jchemhub.math.Line, goog.math.Line);

/**
 * 
 * @return angle of elevation between this line and the x-axis in radians
 */
jchemhub.math.Line.prototype.getTheta = function() {
	var xdelta = this.x1 - this.x0;
	var ydelta = this.y1 - this.y0;
	return Math.atan2(ydelta, xdelta);
}

/**
 * 
 * @return {goog.math.Coordinate} start point of line
 */
jchemhub.math.Line.prototype.getStart = function(){
	return new goog.math.Coordinate(this.x0, this.y0);
}

/**
 * 
 * @return {goog.math.Coordinate} end point of line
 */
jchemhub.math.Line.prototype.getEnd = function(){
	return new goog.math.Coordinate(this.x1, this.y1);	
}