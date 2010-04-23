goog.provide("jchemhub.view.MoleculeDrawing");
goog.require("jchemhub.view.AtomDrawing");
goog.require("jchemhub.view.SingleBondDownDrawing");
goog.require("jchemhub.view.SingleBondDrawing");
goog.require("jchemhub.view.SingleBondUpDrawing");
goog.require("jchemhub.view.SingleBondEitherDrawing");
goog.require("jchemhub.view.DoubleBondDrawing");
goog.require("jchemhub.view.TripleBondDrawing");
goog.require("goog.math.Box");

/**
 * A molecule graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.MoleculeDrawing = function(name) {
	jchemhub.view.Drawing.call(this);
	this._name = name;
};
goog.inherits(jchemhub.view.MoleculeDrawing, jchemhub.view.Drawing);

/**
 * render this drawing and all its children
 */
jchemhub.view.MoleculeDrawing.prototype.render = function() {
	this.renderChildren();
};

/**
 * layout molecule to zero-based coords
 * 
 * @override
 */
jchemhub.view.MoleculeDrawing.prototype.layout = function(transform) {

	var size = this.getSize();
	var bbox = this.getBoundingBox();
	var dx = size.height - Math.min(bbox.top, bbox.bottom);
	var dy = size.width - Math.min(bbox.left, bbox.right);
	transform = transform.clone().preConcatenate(
			goog.graphics.AffineTransform.getTranslateInstance(dx, dy));
	jchemhub.view.MoleculeDrawing.superClass_.layout.call(this, transform);
}

/**
 * get bounding box of all the atoms and bonds in this molecule
 * 
 * @return {goog.math.Box}
 */
jchemhub.view.MoleculeDrawing.prototype.getBoundingBox = function() {
	var coords = []
	goog.array.forEach(this.getChildren(), function(child) {
		coords.push.apply(coords, child.getCoordinates());
	});

	return goog.math.Box.boundingBox.apply(null, coords);

};

/**
 * get bounding box size
 * 
 * @return {goog.math.Size}
 */
jchemhub.view.MoleculeDrawing.prototype.getSize = function() {
	var box = this.getBoundingBox();
	var size = new goog.math.Size(Math.abs(box.right - box.left), Math
			.abs(box.bottom - box.top));
	return size;
}
