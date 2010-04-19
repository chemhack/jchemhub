goog.provide("chem.view.MoleculeDrawing");
goog.require("chem.view.AtomDrawing");
goog.require("chem.view.SingleBondDownDrawing");
goog.require("chem.view.SingleBondDrawing");
goog.require("chem.view.SingleBondUpDrawing");
goog.require("chem.view.SingleBondEitherDrawing");
goog.require("chem.view.DoubleBondDrawing");
goog.require("chem.view.TripleBondDrawing");
goog.require("goog.math.Box");


/**
 * A molecule graphical element in the reaction editor.
 * 
 * @param {chem.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {chem.view.Drawing}
 */
chem.view.MoleculeDrawing = function(name) {
	chem.view.Drawing.call(this);
	this._name = name;
};
goog.inherits(chem.view.MoleculeDrawing, chem.view.Drawing);


/**
 * render this drawing and all its children
 */
chem.view.MoleculeDrawing.prototype.render = function() {
	this.renderChildren();
};

/**
 * layout molecule to zero-based coords
 * @override
 */
chem.view.MoleculeDrawing.prototype.layout = function(transform){

	var size = this.getSize();
	var bbox = this.getBoundingBox();
	var dx = size.height - Math.min(bbox.top, bbox.bottom);
	var dy = size.width - Math.min(bbox.left, bbox.right);
	transform = transform.clone().preConcatenate(goog.graphics.AffineTransform.getTranslateInstance(dx, dy));
	chem.view.MoleculeDrawing.superClass_.layout.call(this, transform);
}

/**
 * get bounding box of all the atoms and bonds in this molecule
 * @return {goog.math.Box} 
 */
chem.view.MoleculeDrawing.prototype.getBoundingBox = function() {
	var coords = []
	goog.array.forEach(this.getChildren(), function(child){
		coords.push.apply(coords, child.getCoordinates());
	});

	return goog.math.Box.boundingBox.apply(null, coords);
	
};

/**
 * get bounding box size
 * @return {goog.math.Size}
 */
chem.view.MoleculeDrawing.prototype.getSize = function(){
	var box = this.getBoundingBox();
	var size = new goog.math.Size(box.right - box.left, box.bottom - box.top);
	return size;
}

