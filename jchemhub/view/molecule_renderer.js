goog.provide('jchemhub.view.MoleculeRenderer');
goog.require('jchemhub.view.BondRenderer');
goog.require('jchemhub.view.AtomRenderer');

/**
 * Class to render a molecule object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.MoleculeRenderer = function(graphics, opt_config) {
	jchemhub.view.Renderer.call(this, graphics, opt_config);
	this.bondRenderer = new jchemhub.view.BondRenderer(graphics, opt_config);
	this.atomRenderer = new jchemhub.view.AtomRenderer(graphics, opt_config);
}
goog.inherits(jchemhub.view.MoleculeRenderer, jchemhub.view.Renderer);

jchemhub.view.MoleculeRenderer.prototype.render = function(molecule) {
	goog.array.forEach(molecule.bonds, function(bond) {
		this.bondRenderer.render(bond);
	}, this);
	goog.array.forEach(molecule.atoms, function(atom) {
		this.atomRenderer.render(atom);
	}, this);
}