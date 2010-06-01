//License and copyright

/**
 * @fileoverview io utility functions and factory methods for JSON formats
 */
goog.provide('jchemhub.io.json');

goog.require('jchemhub.model.Reaction');
goog.require('jchemhub.model.Molecule');
goog.require('jchemhub.model.SingleBond');
goog.require('jchemhub.model.SingleBondUp');
goog.require('jchemhub.model.SingleBondDown');
goog.require('jchemhub.model.SingleBondUpOrDown');
goog.require('jchemhub.model.DoubleBond');
goog.require('jchemhub.model.TripleBond');
goog.require('jchemhub.model.AromaticBond');
goog.require('jchemhub.model.QuadrupleBond');
goog.require('jchemhub.model.Bond');
goog.require('jchemhub.model.Atom');
goog.require('jchemhub.model.DoubleBond');
goog.require('goog.json');
goog.require('goog.array');

goog.exportSymbol('jchemhub.io.json.readReaction', jchemhub.io.json.readReaction);


/**
 * uses JSON.parse and .stringify; needs def for IE and ?? This allows for a
 * JSON external representation that uses bond atom-index instead of atom
 * objects. So, there are 3 types of things of import here: 1. The actual
 * Molecule object (typically mol here) 2. The object (typically jmol here) in
 * which bond's atom objects are recast as atom indexes 3. The string
 * representaion of jmol There is not use for the JSON string represention of
 * the actual Molecule object.
 */

/**
 * enum for bond types
 * 
 * @enum {string}
 */ 
jchemhub.io.json.BondType = {
		SINGLE_BOND:"SINGLE_BOND",
		DOUBLE_BOND:"DOUBLE_BOND",		
		TRIPLE_BOND:"TRIPLE_BOND",
		QUADRUPLE_BOND:"QUADRUPLE_BOND",
		AROMATIC:"AROMATIC",
		SINGLE_OR_DOUBLE:"SINGLE_OR_DOUBLE",
		SINGLE_OR_AROMATIC:"SINGLE_OR_AROMATIC",
		DOUBLE_OR_AROMATIC:"DOUBLE_OR_AROMATIC",
		ANY:"ANY"
};

/**
 * enum for stereo types
 * 
 * @enum {string}
 */ 
jchemhub.io.json.StereoType = {
		NOT_STEREO:"NOT_STEREO",
		SINGLE_BOND_UP:"SINGLE_BOND_UP",
		SINGLE_BOND_UP_OR_DOWN:"SINGLE_BOND_UP_OR_DOWN",
		SINGLE_BOND_DOWN:"SINGLE_BOND_DOWN"
};

/**
 * maps bond class to bond type code
 * 
 * @param{jchemhub.model.Bond} bond
 * @return{jchembun.io.json.BondType}
 */
jchemhub.io.json.getTypeCode = function(bond){
	if (bond instanceof jchemhub.model.SingleBond){
		return jchemhub.io.json.BondType.SINGLE_BOND;
	}
	if (bond instanceof jchemhub.model.DoubleBond){
		return jchemhub.io.json.BondType.DOUBLE_BOND;
	}
	if (bond instanceof jchemhub.model.TripleBond){
		return jchemhub.io.json.BondType.TRIPLE_BOND;
	}
	throw new Error("Invalid bond type [" + bond + "]");
	
};

/**
 * maps bond class to stereo type code
 * 
 * @param{jchemhub.model.Bond} bond
 * @return{jchemhub.io.json.StereoType}
 */
jchemhub.io.json.getStereoCode = function(bond){
	if (bond instanceof jchemhub.model.SingleBondUp){
		return jchemhub.io.json.StereoType.SINGLE_BOND_UP;
	}
	if (bond instanceof jchemhub.model.SingleBondDown){
		return jchemhub.io.json.StereoType.SINGLE_BOND_DOWN;
	}
	if (bond instanceof jchemhub.model.SingleBondUpOrDown){
		return jchemhub.io.json.StereoType.SINGLE_BOND_UP_OR_DOWN;
	}
	return jchemhub.io.json.StereoType.NOT_STEREO;
	
	
}

/**
 * factory method for bonds
 * 
 * @param{jchemhub.io.json.BondType}type bond-type code
 * @param{jchemhub.io.json.StereoType}stereo stereo-type code
 * @param{jchemhub.model.Atom} source atom at source end of bond
 * @param{jchemhub.model.Atom} target atom at target end of bond
 * 
 * @return{jchemhub.model.Bond}
 */
jchemhub.io.json.createBond = function(type, stereo, source, target) {
	switch (type) {
	case jchemhub.io.json.BondType.SINGLE_BOND:
		switch (stereo) {
		case jchemhub.io.json.StereoType.NOT_STEREO:
			return new jchemhub.model.SingleBond(source, target);
		case jchemhub.io.json.StereoType.SINGLE_BOND_UP:
			return new jchemhub.model.SingleBondUp(source, target);
		case jchemhub.io.json.StereoType.SINGLE_BOND_UP_OR_DOWN:
			return new jchemhub.model.SingleBondUpOrDown(source, target);
		case jchemhub.io.json.StereoType.SINGLE_BOND_DOWN:
			return new jchemhub.model.SingleBondDown(source, target);
		default:
			throw new Error("invalid bond type/stereo [" + type + "]/["
					+ stereo + "]");
		};
	case jchemhub.io.json.BondType.DOUBLE_BOND:
		return new jchemhub.model.DoubleBond(source, target);
	case jchemhub.io.json.BondType.TRIPLE_BOND:
		return new jchemhub.model.TripleBond(source, target);
	case jchemhub.io.json.BondType.AROMATIC:
		return new jchemhub.model.AromaticBond(source, target);
	case jchemhub.io.json.BondType.SINGLE_OR_DOUBLE:
	case jchemhub.io.json.BondType.SINGLE_OR_AROMATIC:
	case jchemhub.io.json.BondType.DOUBLE_OR_AROMATIC: 
	case jchemhub.io.json.BondType.ANY: 
	default:
		throw new Error("invalid bond type/stereo [" + type + "]/[" + stereo
				+ "]");
	};
};


/**
 * convert jmol JSON object or string to molecule
 * 
 * @param{string} arg
 * @return{jchemhub.model.Molecule}
 */
jchemhub.io.json.readMolecule = function(arg) {
	var jmol;
	if (arg.constructor == String) {
		jmol = goog.json.parse(arg);
	} else {
		jmol = arg;
	}
	var mol = new jchemhub.model.Molecule();
	mol.name = jmol.name;
	goog.array.forEach(jmol.atoms, function(a){
		//console.log(a);
		mol.addAtom(new jchemhub.model.Atom(a.symbol, a.coord.x, a.coord.y, a.charge));
	});
	goog.array.forEach(jmol.bondindex, function(b){
		mol.addBond(jchemhub.io.json.createBond(b.type, b.stereo, mol.getAtom(b.source), mol.getAtom(b.target)));
	});
	
	return mol;
};

jchemhub.io.json.writeMolecule = function(mol) {
	return new goog.json.Serializer().serialize(jchemhub.io.json.moleculeToJson(mol));
};


/**
 * convert molecule object to json representation
 * 
 * @param{jchemhub.model.Molecule} mol the molecule to convert
 * @returns{object} in json molecule format
 */
jchemhub.io.json.moleculeToJson = function(mol) {
	var atoms = goog.array.map(mol.atoms, function(a){
		return {symbol: a.symbol, coord:{x: a.coord.x, y: a.coord.y}, charge: a.charge};
	});
	var bonds = goog.array.map(mol.bonds, function(b){
		var btype =   jchemhub.io.json.getTypeCode(b);
		var bstereo = jchemhub.io.json.getStereoCode(b);
		return { source : mol.indexOfAtom(b.source), target : mol.indexOfAtom(b.target), type : btype, stereo : bstereo
		}
	});

	return {
		name : mol.name,
		atoms : atoms,
		bondindex : bonds
	};
};

/**
 * convert JSON reaction representation to reaction object
 * 
 * @param {string|Object}
 *            arg The JSON object string, or object itself
 * @return {jchemhub.model.Reaction}
 */
jchemhub.io.json.readReaction = function(arg) {
	var jrxn;
	if (arg.constructor == String) {
		jrxn = goog.json.parse(arg);
	} else {
		jrxn = arg;
	}
	var rxn = new jchemhub.model.Reaction();
	rxn.header = jrxn.header;
	rxn.reactants = goog.array.map(jrxn.reactants, jchemhub.io.json.readMolecule);
	rxn.products = goog.array.map(jrxn.products, jchemhub.io.json.readMolecule);
	return rxn;
};

/**
 * converts a reaction object to JSON representation
 * 
 * @param{jchemhub.model.Reaction} rxn. The reaction to convert to json
 * @return{object} json representation
 */
jchemhub.io.json.reactionToJson = function (rxn) {
	var header = rxn.header;
	var reactants = goog.array.map(rxn.reactants, jchemhub.io.json.moleculeToJson);
	var products = goog.array.map(rxn.products, jchemhub.io.json.moleculeToJson);
	return {header: header,
		reactants: reactants,
		products: products};
};

jchemhub.io.json.writeReaction = function(rxn){
	return new goog.json.Serializer().serialize(jchemhub.io.json.reactionToJson(rxn));
}


