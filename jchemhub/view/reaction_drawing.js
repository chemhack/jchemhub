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
jchemhub.view.ReactionDrawing = function(reaction) {
	jchemhub.view.Drawing.call(this);
	this.reaction = reaction;
	var first = true;
	goog.array.forEach(reaction.reactants, function(r) {
		if (first) {
			first = false;
		} else {
			this.add(new jchemhub.view.PlusDrawing());
		}
		this.add(jchemhub.controller.Controller.buildMoleculeDrawing(r));
	}, this);

	this.add(new jchemhub.view.ArrowDrawing());

	first = true;
	goog.array.forEach(reaction.products, function(p) {
		if (first) {
			first = false;
		} else {
			this.add(new jchemhub.view.PlusDrawing());
		}
		this.add(jchemhub.controller.Controller.buildMoleculeDrawing(p));
	}, this);
};
goog.inherits(jchemhub.view.ReactionDrawing, jchemhub.view.Drawing);

/**
 * layout drawing and children
 * 
 * @override
 */
jchemhub.view.ReactionDrawing.prototype.layoutChildren = function(to_rect) {
	var size = this.getSize();
	var children = this.getChildren();
	var nchildren = children.length;
	var h_offset = 0;
	goog.array.forEach(children, function(child) {
		var child_size = child.getSize();
		// child gets proportionate fraction of reaction
		var w = (to_rect.width - this.getConfig().get('margin')*(nchildren-1)) * child_size.width / size.width;
		var h = to_rect.height * child_size.height / size.height;
		var x = to_rect.left + h_offset;
		// TTD fix this margin hack
		var y = (size.height-child_size.height)/size.height*0.5*to_rect.height + this.getConfig().get('margin');
		var child_rect = new goog.math.Rect(x, y, w, h);
		child.layout(child_rect);
		h_offset += w + + this.getConfig().get('margin');
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