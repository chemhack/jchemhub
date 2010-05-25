goog.provide('jchemhub.controller.Controller');
goog.require('jchemhub.view.ReactionEditor');
goog.require('jchemhub.view.ReactionDrawing');
goog.require('jchemhub.view.ArrowDrawing');
goog.require('jchemhub.view.PlusDrawing');
goog.require('jchemhub.model.SingleBond');
goog.require('jchemhub.model.SingleBondUp');
goog.require('jchemhub.model.SingleBondDown');
goog.require('jchemhub.model.SingleBondUpOrDown');
goog.require('jchemhub.model.DoubleBond');
goog.require('jchemhub.model.TripleBond');
goog.require('jchemhub.model.QuadrupleBond');
goog.require('jchemhub.model.Bond');
goog.require('jchemhub.model.Atom');
goog.require('jchemhub.view.SingleBondDrawing');
goog.require('jchemhub.io.json');
goog.require('jchemhub.io.mdl');

jchemhub.controller.Controller = function(element, opt_editor_config) {

	this._view = new jchemhub.view.ReactionEditor(element, opt_editor_config);
};

jchemhub.controller.Controller.prototype.getModel = function(){
	return this._view.getModel();
};

jchemhub.controller.Controller.prototype.clear = function(){
	this._view.clear();
};

jchemhub.controller.Controller.prototype.setModel = function(model){
	this._view.setModel(model);
};

jchemhub.controller.Controller.buildReactionDrawing = function(rxn) {
	return new jchemhub.view.ReactionDrawing(rxn);
};

jchemhub.controller.Controller.buildMoleculeDrawing = function(molecule) {
	return new jchemhub.view.MoleculeDrawing(molecule);
};

jchemhub.controller.Controller.createBondDrawing = function(bond) {
	if (bond instanceof jchemhub.model.SingleBondUp) {
		return new jchemhub.view.SingleBondUpDrawing(bond);
	}
	if (bond instanceof jchemhub.model.SingleBondDown) {
		return new jchemhub.view.SingleBondDownDrawing(bond);
	}
	if (bond instanceof jchemhub.model.SingleBondUpOrDown) {
		return new jchemhub.view.SingleBondEitherDrawing(bond);
	}
	if (bond instanceof jchemhub.model.SingleBond) {
		return new jchemhub.view.SingleBondDrawing(bond);
	}
	if (bond instanceof jchemhub.model.DoubleBond) {
		return new jchemhub.view.DoubleBondDrawing(bond);
	}
	if (bond instanceof jchemhub.model.TripleBond) {
		return new jchemhub.view.TripleBondDrawing(bond);
	}
};
