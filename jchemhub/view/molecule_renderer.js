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
	jchemhub.view.Renderer.call(this, graphics, opt_config, jchemhub.view.MoleculeRenderer.defaultConfig);
	this.bondRendererFactory = new jchemhub.view.BondRenderer.Factory(graphics);
	this.atomRenderer = new jchemhub.view.AtomRenderer(graphics);
}
goog.inherits(jchemhub.view.MoleculeRenderer, jchemhub.view.Renderer);

jchemhub.view.MoleculeRenderer.prototype.render = function(molecule, trans, group) {
	goog.array.forEach(molecule.bonds, function(bond) {
		this.bondRendererFactory.get(bond).render(bond, trans, group);
	}, this);
	goog.array.forEach(molecule.atoms, function(atom) {
		this.atomRenderer.render(atom, trans, group);
	}, this);
}