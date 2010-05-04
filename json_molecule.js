goog.provide('jchemhub.io.JSONMolecule');

goog.require('jchemhub.model.Molecule');
goog.require('jchemhub.model.Atom');
goog.require('jchemhub.model.Bond');


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
 * Static method for reading JSON representation of mol object. import data into
 * mol object
 * 
 * @param {Object}
 *            The JSON object string or object itself
 */
 /** get string representation for bond type from integer
 */
jchemhub.io.JSONMolecule.getBondType = function(i) {
	for (var key in jchemhub.model.Bond.BondType) {
		if (jchemhub.model.Bond.BondType[key] == i) return key;
	}
	return undefined;
};

/** get string representation for bond stereo type from integer
 */
jchemhub.io.JSONMolecule.getBondStereoType = function(i, btype) {
	if (btype == jchemhub.io.Molfile.SINGLE_BOND) {
		for (var key in jchemhub.model.Bond.StereoType.Single) {
			if (jchemhub.model.Bond.StereoType.Single[key] == i) return key;
		}
	} else if (btype == jchemhub.model.Bond.BondType.Double) {
		for (var key in jchemhub.model.Bond.StereoType.Double) {
			if (jchemhub.model.Bond.StereoType.Double[key] == i) return key;
		}
	}
	return undefined;
};

jchemhub.io.JSONMolecule.write = function(mol) {
	return mol.toString();
};

jchemhub.io.JSONMolecule.read = function(arg) {
	var jmol;
	if (arg.constructor == String) {
		jmol = JSON.parse(arg);
	} else {
		jmol = arg;
	}
	var mol = new jchemhub.model.Molecule();
	mol.name = jmol.name;
	for (var i in jmol.atoms) {
		var a = jmol.atoms[i];
		var newatom = new jchemhub.model.Atom();
		newatom.symbol = a.symbol;
		newatom.x = a.x;
		newatom.y = a.y;
		newatom.z = a.z;
		newatom.charge = a.charge;
		mol.addAtom(newatom);
	}
	var atoms = mol.atoms;
	for (var i in jmol.bondindex) {
		var b = jmol.bondindex[i];
		var newbond = new jchemhub.model.Bond();
		newbond.source = atoms[b.source];
		newbond.target = atoms[b.target];
		newbond.bondType = b.type;
		newbond.stereoType = b.stereo;
		mol.addBond(newbond);
	}
	return mol;
};

/**
 * export data from mol object returns The JSON representation of mol object.
 */
jchemhub.model.Molecule.prototype.toString = function() {
	var atoms = new Array();
	for (var i in this.atoms) {
		var a = this.atoms[i];
		atoms.push( {
			symbol : a.symbol,
			x : a.x,
			y : a.y,
			z : a.z,
			charge : a.charge
		});
	}
	var bonds = new Array();
	for (var i in this.bonds) {
		var b = this.bonds[i];
		var btype =   jchemhub.io.JSONMolecule.getBondType(b.bondType);
		var bstereo = jchemhub.io.JSONMolecule.getBondStereoType(b.stereoType, b.bondType);
		bonds.push( {
			source : this.indexOfAtom(b.source),
			target : this.indexOfAtom(b.target),
			type : btype,
			stereo : bstereo
		});
	}
	return JSON.stringify( {
		name : this.name,
		atoms : atoms,
		bondindex : bonds
	});
};

