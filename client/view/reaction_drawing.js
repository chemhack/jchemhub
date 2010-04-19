goog.provide("chem.view.ReactionDrawing");
goog.require("chem.view.Drawing");
goog.require("chem.view.MoleculeDrawing");
goog.require("goog.graphics.AffineTransform");
/**
 * A reaction graphical element in the reaction editor.
 * 
 * @param {chem.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {chem.view.Drawing}
 */
chem.view.ReactionDrawing = function() {
	chem.view.Drawing.call(this);
};
goog.inherits(chem.view.ReactionDrawing, chem.view.Drawing);

/**
 * layout reaction to fit size of graphics
 * @override
 */
chem.view.ReactionDrawing.prototype.layout = function(transform){
	// scale to fit graphics size
	transform = transform.clone().concatenate(this.createScalingTransform(this.getGraphics().getSize()));
//	console.log("scale ")
//	console.log(transform);
	chem.view.ReactionDrawing.superClass_.layout.call(this, transform);
}

/**
 * layout drawing and children
 * @override
 */
chem.view.ReactionDrawing.prototype.layoutChildren = function(transform) {
//	console.log("layoutChildren");
	goog.array.forEach(this.getChildren(), function(child) {
		// translate each child to center of its box
		transform = transform.clone().concatenate(goog.graphics.AffineTransform.getTranslateInstance(child.getSize().width/2, 0));
//		console.log(transform);
		child.layout(transform);
		// translate each child to prevent overlaps
		transform = transform.clone().concatenate(goog.graphics.AffineTransform.getTranslateInstance(child.getSize().width/2, 0));
	}, this);
}

/**
 * render this drawing and all its children
 */
chem.view.ReactionDrawing.prototype.render = function() {
	this.renderChildren();
};

/**
 * size of reaction drawing is combined children widths and max children height
 * 
 * @return {goog.math.Size}
 */
chem.view.ReactionDrawing.prototype.getSize = function() {
	return new goog.math.Size(this.getTotalChildrenWidth(), this
			.getMaxChildrenHeight());
}

/**
 * create scaling transform to scale to targetSize while retaining aspect ratio
 * 
 * @param {goog.math.Size}
 */
chem.view.ReactionDrawing.prototype.createScalingTransform = function(targetSize) {
	var size = this.getSize();
	var before = size.width;
	var after = size.scaleToFit(targetSize).width;
	return goog.graphics.AffineTransform.getScaleInstance(
			after / before, after / before);
}


chem.view.ReactionDrawing.prototype.getTotalChildrenWidth = function() {
	return goog.array.reduce(this.getChildren(), function(r, v, i, arr) {
		return r + v.getSize().width;
	}, 0);
}

chem.view.ReactionDrawing.prototype.getMaxChildrenHeight = function() {
	return goog.array.reduce(this.getChildren(), function(r, v, i, arr) {
		return Math
				.max(r, v.getSize().height);
	}, 0);
}