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
	var previous;
	goog.array.forEach(reaction.reactants, function(m) {
		if (previous) {
			var m_center = jchemhub.view.ReactionDrawing.center([previous, m]);
			this.add(new jchemhub.view.PlusDrawing(m_center));
		}
		previous = m;
		this.add(jchemhub.controller.Controller.buildMoleculeDrawing(m));
	}, this);

	var r_center = jchemhub.view.ReactionDrawing.center(goog.array.concat(reaction.reactants, reaction.products));
	this.add(new jchemhub.view.ArrowDrawing(r_center));

	previous = null;
	goog.array.forEach(reaction.products, function(m) {
		if (previous) {
			var m_center = jchemhub.view.ReactionDrawing.center([previous, m]);
			this.add(new jchemhub.view.PlusDrawing(m_center));
		}
		previous = m;
		this.add(jchemhub.controller.Controller.buildMoleculeDrawing(m));
	}, this);
};
goog.inherits(jchemhub.view.ReactionDrawing, jchemhub.view.Drawing);


jchemhub.view.ReactionDrawing.center = function(molecules){
	var rect = jchemhub.view.MoleculeDrawing.boundingRect(molecules);
	return new goog.math.Coordinate(rect.left + rect.width/2, rect.top + rect.height/2);
	
}

/**
 * render this drawing and all its children
 */
jchemhub.view.ReactionDrawing.prototype.render = function() {
	this.renderChildren();
};

jchemhub.view.ReactionDrawing.prototype.getRect = function() {
	return jchemhub.view.MoleculeDrawing.boundingRect(goog.array.concat(
			this.reaction.reactants, this.reaction.products));
}