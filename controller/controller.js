goog.provide('jchemhub.controller.Controller');
goog.require('jchemhub.view.ReactionEditor');
goog.require('jchemhub.view.ReactionDrawing');
goog.require('jchemhub.view.ArrowDrawing');
goog.require('jchemhub.view.PlusDrawing');
goog.require('jchemhub.io.Rxnfile');

jchemhub.controller.Controller = function(model, element, opt_editor_config) {
	this._model = model;
	this._view = new jchemhub.view.ReactionEditor(element, opt_editor_config);
	this._view.add(model);
	this._view.layoutAndRender();
}

jchemhub.controller.Controller.buildReactionDrawing = function(rxn) {
	var rxn_drawing = new jchemhub.view.ReactionDrawing();
	var first = true;
	goog.array.forEach(rxn.reactants, function(r) {
		if (first) {
			first = false;
		} else {
			rxn_drawing.add(new jchemhub.view.PlusDrawing());
		}
		rxn_drawing.add(jchemhub.controller.Controller.buildMoleculeDrawing(r));
	});

	rxn_drawing.add(new jchemhub.view.ArrowDrawing());

	first = true;
	goog.array.forEach(rxn.products, function(p) {
		if (first) {
			first = false;
		} else {
			rxn_drawing.add(new jchemhub.view.PlusDrawing());
		}
		rxn_drawing.add(jchemhub.controller.Controller.buildMoleculeDrawing(p));
	});
	return rxn_drawing;
};

jchemhub.controller.Controller.buildMoleculeDrawing = function(molecule) {
	var mol_drawing = new jchemhub.view.MoleculeDrawing(molecule.getName());

	goog.array.forEach(molecule.atoms,
			function(atom) {
				mol_drawing.add(new jchemhub.view.AtomDrawing(atom.x, atom.y,
						atom.symbol));
			});
	goog.array.forEach(molecule.bonds, function(bond) {
		mol_drawing.add(jchemhub.controller.Controller.createBondDrawing(
				bond.source.x, bond.source.y, bond.target.x, bond.target.y,
				bond.bondType, bond.stereoType));
	});
	return mol_drawing;
};

jchemhub.controller.Controller.createBondDrawing = function(x0, y0, x1, y1,
		bondType, stereoType) {
	var bond;

	switch (bondType) {
	case jchemhub.model.Bond.BondType.Single:
		switch (stereoType) {
		case jchemhub.model.Bond.StereoType.Single.NotStereo:
			bond = new jchemhub.view.SingleBondDrawing(x0, y0, x1, y1);
			break;
		case jchemhub.model.Bond.StereoType.Single.Up:
			bond = new jchemhub.view.SingleBondUpDrawing(x0, y0, x1, y1);
			break;
		case jchemhub.model.Bond.StereoType.Single.Down:
			bond = new jchemhub.view.SingleBondDownDrawing(x0, y0, x1, y1);
			break;
		case jchemhub.model.Bond.StereoType.Single.Either:
			bond = new jchemhub.view.SingleBondEitherDrawing(x0, y0, x1, y1);
			break;
		}
		break;
	case jchemhub.model.Bond.BondType.Double:
		bond = new jchemhub.view.DoubleBondDrawing(x0, y0, x1, y1);
		break;
	case jchemhub.model.Bond.BondType.Triple:
		bond = new jchemhub.view.TripleBondDrawing(x0, y0, x1, y1);
		break;
	case jchemhub.model.Bond.BondType.Aromatic:
		break;
	}
	return bond;
};
