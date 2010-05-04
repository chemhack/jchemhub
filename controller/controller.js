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

jchemhub.controller.Controller = function(model, element, opt_editor_config) {
	this._model = model;
	this._view = new jchemhub.view.ReactionEditor(element, opt_editor_config);
	this._view.add(model);
	this._view.layoutAndRender();
}

jchemhub.controller.Controller.buildReactionDrawing = function(rxn) {
	var rxn_drawing = new jchemhub.view.ReactionDrawing();
	var first = true;
	goog.array.forEach(rxn.reactants,
			function(r) {
				if (first) {
					first = false;
				} else {
					rxn_drawing.add(new jchemhub.view.PlusDrawing());
				}
				rxn_drawing.add(jchemhub.controller.Controller
						.buildMoleculeDrawing(r));
			});

	rxn_drawing.add(new jchemhub.view.ArrowDrawing());

	first = true;
	goog.array.forEach(rxn.products,
			function(p) {
				if (first) {
					first = false;
				} else {
					rxn_drawing.add(new jchemhub.view.PlusDrawing());
				}
				rxn_drawing.add(jchemhub.controller.Controller
						.buildMoleculeDrawing(p));
			});
	return rxn_drawing;
};

jchemhub.controller.Controller.buildMoleculeDrawing = function(molecule) {
	var mol_drawing = new jchemhub.view.MoleculeDrawing(molecule.name);

	goog.array.forEach(molecule.atoms, function(atom) {
		mol_drawing.add(new jchemhub.view.AtomDrawing(atom));
	});
	goog.array.forEach(molecule.bonds,
			function(bond) {
				mol_drawing.add(jchemhub.controller.Controller
						.createBondDrawing(bond));
			});
	return mol_drawing;
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
