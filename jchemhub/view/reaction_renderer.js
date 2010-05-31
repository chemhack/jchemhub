goog.provide('jchemhub.view.ReactionRenderer');
goog.require('jchemhub.view.Renderer');
goog.require('jchemhub.controller.MoleculeController');
goog.require('jchemhub.view.MoleculeRenderer');
goog.require('jchemhub.view.ArrowRenderer');
goog.require('jchemhub.view.PlusRenderer');
goog.require("goog.math.Coordinate");
goog.require("jchemhub.graphics.AffineTransform");

/**
 * Class to render a reaction object to a graphics object
 * 
 * @constructor
 * @param parentEventTarget {goog.events.EventTarget}
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.ReactionRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.Renderer.call(this, controller, graphics, opt_config);
	this.scale_factor = 1;
	this.moleculeController = new jchemhub.controller.MoleculeController(controller);
	this.moleculeRenderer = new jchemhub.view.MoleculeRenderer(this.moleculeController, graphics,
			this.config);
	this.arrowRenderer = new jchemhub.view.ArrowRenderer(controller, graphics, this.config);
	this.plusRenderer = new jchemhub.view.PlusRenderer(controller, graphics, this.config);
}
goog.inherits(jchemhub.view.ReactionRenderer, jchemhub.view.Renderer);
/**
 * 
 * @param {jchemhub.model.Reaction} reaction
 * @return {goog.graphics.GroupElement}
 */
jchemhub.view.ReactionRenderer.prototype.render = function(reaction) {
	var previousReactant;
	var transform = this.getTransform(reaction);
	var group = this.graphics.createGroup();
	goog.array.forEach(reaction.reactants, function(reactant) {
		if (previousReactant) {
			var center = jchemhub.view.ReactionRenderer.center( [ previousReactant, reactant ]);
			this.plusRenderer.render(center, transform, group);
		}
		previousReactant = reactant;
		this.moleculeRenderer.render(reactant, transform, group);
	},this);
	
	var reaction_center = jchemhub.view.ReactionRenderer.center(goog.array.concat(reaction.reactants, reaction.products));
	this.arrowRenderer.render(reaction_center, transform, group);

	var previousProduct = null;
	goog.array.forEach(reaction.products, function(product) {
		if (previousProduct) {
			var center = jchemhub.view.ReactionRenderer.center( [ previousProduct, product ]);
			this.plusRenderer.render(center, transform, group);
		}
		previousProduct=product;
		this.moleculeRenderer.render(product, transform, group);
	}, this);
	return group;
}

/**
 * finds center of an array of molecules
 * 
 * @return goog.math.Coordinate
 */
jchemhub.view.ReactionRenderer.center = function(molecules) {
	var bbox = jchemhub.view.ReactionRenderer.boundingBox(molecules);
	return new goog.math.Coordinate( (bbox.left
			+ bbox.right) / 2, (bbox.top + bbox.bottom) / 2);
}

/**
 * finds bounding box of an array of molecules
 * 
 * @param molecules
 * @return goog.math.Box
 */

jchemhub.view.ReactionRenderer.boundingBox = function(molecules) {
	var atoms = goog.array.flatten(goog.array.map(molecules, function(mol) {
		return mol.atoms;
	}));
	var coords = goog.array.map(atoms, function(a) {
		return a.coord;
	})
	return goog.math.Box.boundingBox.apply(null, coords);
}

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.ReactionRenderer.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.ReactionRenderer');

/**
 * 
 * @param {Array.<jchemhub.model.Molecule>} molecules
 * @return {goog.math.Rect}
 */
jchemhub.view.ReactionRenderer.boundingRect = function(molecules){
	return goog.math.Rect.createFromBox(jchemhub.view.ReactionRenderer.boundingBox(molecules));
}
/**
 * 
 * @param {jchemhub.model.Reaction} reaction
 * @return {jchemhub.graphics.AffineTransform}
 */
jchemhub.view.ReactionRenderer.prototype.getTransform=function(reaction){
	var molecules = goog.array.concat(reaction.reactants, reaction.products);
	var fromRect = jchemhub.view.ReactionRenderer.boundingRect(molecules);
	var toSize = fromRect.getSize().scaleToFit(this.graphics.getSize());
	var scale = this.scale_factor * toSize.width / fromRect.getSize().width;
	
	var transform = new jchemhub.graphics.AffineTransform(scale,0,0,-scale,-fromRect.left*scale,-fromRect.top*scale );	

	return transform;
};

	
