goog.provide("jchemhub.view.ReactionDrawing");
goog.require("jchemhub.view.Drawing");
goog.require("jchemhub.view.MoleculeDrawing");
goog.require("goog.graphics.AffineTransform");
/**
 * A reaction graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.ReactionDrawing = function() {
	jchemhub.view.Drawing.call(this);
};
goog.inherits(jchemhub.view.ReactionDrawing, jchemhub.view.Drawing);

/**
 * layout reaction to fit size of graphics
 * @override
 */
jchemhub.view.ReactionDrawing.prototype.layout = function(transform){
	// scale to fit graphics size
	transform = transform.clone().concatenate(this.createScalingTransform(this.getGraphics().getSize()));
//	console.log("scale ")
//	console.log(transform);
	jchemhub.view.ReactionDrawing.superClass_.layout.call(this, transform);
}

/**
 * layout drawing and children
 * @override
 */
jchemhub.view.ReactionDrawing.prototype.layoutChildren = function(transform) {
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
jchemhub.view.ReactionDrawing.prototype.render = function() {
	this.renderChildren();
};

/**
 * size of reaction drawing is combined children widths and max children height
 * 
 * @return {goog.math.Size}
 */
jchemhub.view.ReactionDrawing.prototype.getSize = function() {
	return new goog.math.Size(this.getTotalChildrenWidth(), this
			.getMaxChildrenHeight());
}

/**
 * create scaling transform to scale to targetSize while retaining aspect ratio
 * 
 * @param targetSize{goog.math.Size}
 */
jchemhub.view.ReactionDrawing.prototype.createScalingTransform = function(targetSize) {
	var size = this.getSize();
	var before = size.width;
	var after = size.scaleToFit(targetSize).width;
	return goog.graphics.AffineTransform.getScaleInstance(
			after / before, after / before);
}


jchemhub.view.ReactionDrawing.prototype.getTotalChildrenWidth = function() {
	return goog.array.reduce(this.getChildren(), function(r, v, i, arr) {
		return r + v.getSize().width;
	}, 0);
}

jchemhub.view.ReactionDrawing.prototype.getMaxChildrenHeight = function() {
	return goog.array.reduce(this.getChildren(), function(r, v, i, arr) {
		return Math
				.max(r, v.getSize().height);
	}, 0);
}