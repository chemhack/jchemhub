goog.provide('jchemhub.graphics.AffineTransform');
goog.require('goog.graphics.AffineTransform');

/**
 * {@inheritDoc}
 * 
 * @constructor
 * @extends {goog.graphics.AffineTransform}
 */
jchemhub.graphics.AffineTransform = function(opt_m00, opt_m10, opt_m01,
		opt_m11, opt_m02, opt_m12) {
	goog.graphics.AffineTransform.call(this);
	if (arguments.length == 6) {
		this.setTransform(/** @type {number} */
		(opt_m00),
		/** @type {number} */
		(opt_m10),
		/** @type {number} */
		(opt_m01),
		/** @type {number} */
		(opt_m11),
		/** @type {number} */
		(opt_m02),
		/** @type {number} */
		(opt_m12));
	}	
}
goog.inherits(jchemhub.graphics.AffineTransform, goog.graphics.AffineTransform);

/**
 * transform array of coordinates
 * 
 * @param source_coords{!Array.
 *            <goog.math.Coordinate>}
 * @return {!Array.<goog.math.Coordinate>}
 */
jchemhub.graphics.AffineTransform.prototype.transformCoords = function(
		source_coords) {
	var pairs = goog.array.map(source_coords, function(coord) {
		return [ coord.x, coord.y ];
	});
	var source_points = goog.array.flatten(pairs);
	var dest_points = [];
	this.transform(source_points, 0, dest_points, 0, source_points.length / 2)

	var dest_coords = [];
	for ( var i = 0; i < dest_points.length; i += 2) {
		dest_coords.push(new goog.math.Coordinate(dest_points[i],
				dest_points[i + 1]));
	}
	;
	return dest_coords;
};