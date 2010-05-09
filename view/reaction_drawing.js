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
 * layout drawing and children
 * 
 * @override
 */
jchemhub.view.ReactionDrawing.prototype.layoutChildren = function(to_rect) {
	var size = this.getSize();
	var h_offset = 0;
	goog.array.forEach(this.getChildren(), function(child) {
		var child_size = child.getSize();
		var w = to_rect.width * child_size.width / size.width; // child gets
			// proportionate
			// fraction of
			// reaction
			var h = to_rect.height;
			var x = to_rect.left + h_offset;
			//TTD fix this margin hack
			var y = to_rect.top - this.getConfig().get('margin')*10 + h / 2
					- (h * child_size.width / size.width) / 2;
			var child_rect = new goog.math.Rect(x, y, w, h);
			child.layout(child_rect);
			h_offset += w;
		}, this);
}

/**
 * @override
 * 
 * @return {goog.math.Box}
 */
jchemhub.view.ReactionDrawing.prototype.getBoundingBox = function() {
	var box = new goog.math.Box(0, 0, 0, 0);
	goog.array.forEach(this.getChildren(), function(child) {
		box.right += child.getSize().width;
		box.bottom = Math.max(box.bottom, child.getSize().height);
	}, this);
	return box;
};

/**
 * render this drawing and all its children
 */
jchemhub.view.ReactionDrawing.prototype.render = function() {
	this.renderChildren();
};

jchemhub.view.Drawing.prototype.updateTransformedCoords = function() {
};