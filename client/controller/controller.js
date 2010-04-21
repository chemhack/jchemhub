goog.provide('chem.controller.Controller');
goog.require('chem.view.ReactionEditor');
goog.require('chem.view.ReactionDrawing');
goog.require('chem.view.ArrowDrawing');
goog.require('chem.view.PlusDrawing');
goog.require('chem.io.Rxnfile');

chem.controller.Controller = function(model, element, opt_editor_config) {
	this._model = model;
	this._view = new chem.view.ReactionEditor(element, opt_editor_config);
	this._view.add(model);
	this._view.layoutAndRender();
}

chem.controller.Controller.buildReactionDrawing = function(rxn) {
	var rxn_drawing = new chem.view.ReactionDrawing();
	var first = true;
	goog.array.forEach(rxn.reactants, function(r) {
		if (first) {
			first = false;
		} else {
			rxn_drawing.add(new chem.view.PlusDrawing());
		}
		rxn_drawing.add(chem.controller.Controller.buildMoleculeDrawing(r));
	});

	rxn_drawing.add(new chem.view.ArrowDrawing());

	first = true;
	goog.array.forEach(rxn.products, function(p) {
		if (first) {
			first = false;
		} else {
			rxn_drawing.add(new chem.view.PlusDrawing());
		}
		rxn_drawing.add(chem.controller.Controller.buildMoleculeDrawing(p));
	});
	return rxn_drawing;
};

chem.controller.Controller.buildMoleculeDrawing = function(molecule) {
	var mol_drawing = new chem.view.MoleculeDrawing(molecule.getName());

	goog.array.forEach(molecule.atoms,
			function(atom) {
				mol_drawing.add(new chem.view.AtomDrawing(atom.x, atom.y,
						atom.symbol));
			});
	goog.array.forEach(molecule.bonds, function(bond) {
		mol_drawing.add(chem.controller.Controller.createBondDrawing(
				bond.source.x, bond.source.y, bond.target.x, bond.target.y,
				bond.bondType, bond.stereoType));
	});
	return mol_drawing;
};

chem.controller.Controller.createBondDrawing = function(x0, y0, x1, y1,
		bondType, stereoType) {
	var bond;

	switch (bondType) {
	case chem.core.Bond.BondType.Single:
		switch (stereoType) {
		case chem.core.Bond.StereoType.Single.NotStereo:
			bond = new chem.view.SingleBondDrawing(x0, y0, x1, y1);
			break;
		case chem.core.Bond.StereoType.Single.Up:
			bond = new chem.view.SingleBondUpDrawing(x0, y0, x1, y1);
			break;
		case chem.core.Bond.StereoType.Single.Down:
			bond = new chem.view.SingleBondDownDrawing(x0, y0, x1, y1);
			break;
		case chem.core.Bond.StereoType.Single.Either:
			bond = new chem.view.SingleBondEitherDrawing(x0, y0, x1, y1);
			break;
		}
		break;
	case chem.core.Bond.BondType.Double:
		bond = new chem.view.DoubleBondDrawing(x0, y0, x1, y1);
		break;
	case chem.core.Bond.BondType.Triple:
		bond = new chem.view.TripleBondDrawing(x0, y0, x1, y1);
		break;
	case chem.core.Bond.BondType.Aromatic:
		break;
	}
	return bond;
};
