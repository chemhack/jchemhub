goog.provide('jchemhub.view.MoleculeRenderer');
goog.require('jchemhub.controller.BondController');
goog.require('jchemhub.view.BondRenderer');
goog.require('jchemhub.view.BondRenderer.Factory');
goog.require('jchemhub.view.AtomRenderer');
goog.require('jchemhub.controller.AtomController');

/**
 * Class to render a molecule object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.MoleculeRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.Renderer.call(this, controller, graphics, opt_config, jchemhub.view.MoleculeRenderer.defaultConfig);
	this.bondController = new jchemhub.controller.BondController(controller);
	this.bondRendererFactory = new jchemhub.view.BondRenderer.Factory(this.bondController, graphics);
	this.atomController = new jchemhub.controller.AtomController(controller);
	this.atomRenderer = new jchemhub.view.AtomRenderer(this.atomController, graphics);
}
goog.inherits(jchemhub.view.MoleculeRenderer, jchemhub.view.Renderer);

jchemhub.view.MoleculeRenderer.prototype.render = function(molecule, trans, group) {
	this.transform = trans;
	goog.array.forEach(molecule.bonds, function(bond) {
		this.bondRendererFactory.get(bond).render(bond, trans, group);
	}, this);
	goog.array.forEach(molecule.atoms, function(atom) {
		this.atomRenderer.render(atom, trans, this.atomController);
	}, this);
}