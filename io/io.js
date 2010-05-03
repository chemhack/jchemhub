//Licence and copyright

goog.provide('jchemhub.io.Molfile');
goog.provide('jchemhub.io.Rxnfile');
goog.provide('jchemhub.io.JSONMolecule');
goog.provide('jchemhub.io.JSONReaction');

goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.string');
goog.require('jchemhub.model.Reaction');
goog.require('jchemhub.model.Molecule');
goog.require('jchemhub.model.SingleBond');
goog.require('jchemhub.model.SingleBondUp');
goog.require('jchemhub.model.SingleBondDown');
goog.require('jchemhub.model.SingleBondUpOrDown');
goog.require('jchemhub.model.DoubleBond');
goog.require('jchemhub.model.TripleBond');
goog.require('jchemhub.model.QuadrupleBond');
goog.require('jchemhub.model.Bond');
goog.require('jchemhub.model.Atom');

/** @const */ jchemhub.io.Molfile.SINGLE_BOND = 1;
/** @const */ jchemhub.io.Molfile.DOUBLE_BOND = 2;
/** @const */ jchemhub.io.Molfile.TRIPLE_BOND = 3;
/** @const */ jchemhub.io.Molfile.AROMATIC = 4;
/** @const */ jchemhub.io.Molfile.SINGLE_OR_DOUBLE = 5;
/** @const */ jchemhub.io.Molfile.SINGLE_OR_AROMATIC = 6;
/** @const */ jchemhub.io.Molfile.DOUBLE_OR_AROMATIC = 7;
/** @const */ jchemhub.io.Molfile.ANY = 8;
/** @const */ jchemhub.io.Molfile.TRIPLE_BOND = 3;

/** @const */ jchemhub.io.Molfile.NOT_STEREO = 0;
/** @const */ jchemhub.io.Molfile.SINGLE_BOND_UP = 1;
/** @const */ jchemhub.io.Molfile.SINGLE_BOND_UP_OR_DOWN = 4;
/** @const */ jchemhub.io.Molfile.SINGLE_BOND_DOWN = 6;
/**
 * returns molfile bond type code
 * 
 * @param{jchemhub.model.Bond} bond
 * @return{number}
 */
jchemhub.io.Molfile.getTypeCode = function(bond){
	if (bond instanceof jchemhub.model.SingleBond){
		return jchemhub.io.Molfile.SINGLE_BOND;
	}
	if (bond instanceof jchemhub.model.DoubleBond){
		return jchemhub.io.Molfile.DOUBLE_BOND;
	}
	if (bond instanceof jchemhub.model.TripleBond){
		return jchemhub.io.Molfile.TRIPLE_BOND;
	}
	throw new Error("Invalid bond type [" + bond + "]");
	
};

jchemhub.io.Molfile.getStereoCode = function(bond){
	if (bond instanceof jchemhub.model.SingleBondUp){
		return jchemhub.io.Molfile.SINGLE_BOND_UP;
	}
	if (bond instanceof jchemhub.model.SingleBondDown){
		return jchemhub.io.Molfile.SINGLE_BOND_DOWN;
	}
	if (bond instanceof jchemhub.model.SingleBondUpOrDown){
		return jchemhub.io.Molfile.SINGLE_BOND_UP_OR_DOWN;
	}
	return jchemhub.io.Molfile.NOT_STEREO;
	
	
}
/**
 * Bond Types, values in molfile spec. Values 4 through 8 are for SSS queries
 * only.
 */
jchemhub.io.Molfile.BondFactory = function(type, stereo, source, target) {
	switch (type) {
	case jchemhub.io.Molfile.SINGLE_BOND:
		switch (stereo) {
		case jchemhub.io.Molfile.NOT_STEREO:
			return new jchemhub.model.SingleBond(source, target);
		case jchemhub.io.Molfile.SINGLE_BOND_UP:
			return new jchemhub.model.SingleBondUp(source, target);
		case jchemhub.io.Molfile.SINGLE_BOND_UP_OR_DOWN:
			return new jchemhub.model.SingleBondUpOrDown(source, target);
		case jchemhub.io.Molfile.SINGLE_BOND_DOWN:
			return new jchemhub.model.SingleBondDown(source, target);
		default:
			throw new Error("invalid bond type/stereo [" + type + "]/["
					+ stereo + "]");
		};
	case jchemhub.io.Molfile.DOUBLE_BOND:
		return new jchemhub.model.DoubleBond(source, target);
	case jchemhub.io.Molfile.TRIPLE_BOND:
		return new jchemhub.model.TripleBond(source, target);
	case jchemhub.io.Molfile.AROMATIC:
		throw new Error("type not implemented [" + type + "]");
	case jchemhub.io.Molfile.SINGLE_OR_DOUBLE:
		throw new Error("type not implemented [" + type + "]");
	case jchemhub.io.Molfile.SINGLE_OR_AROMATIC:
		throw new Error("type not implemented [" + type + "]");
	case jchemhub.io.Molfile.DOUBLE_OR_AROMATIC: 
		throw new Error("type not implemented [" + type + "]");
	case jchemhub.io.Molfile.ANY: 
		throw new Error("type not implemented [" + type + "]");
	default:
		throw new Error("invalid bond type/stereo [" + type + "]/[" + stereo
				+ "]");
	};
};

/**
 * @fileoverview IO classes
 * 
 */

/**
 * Static method for reading molfile
 * 
 * @param {String}
 *            molfile Content of molfile to read.
 */
jchemhub.io.Molfile.read = function(molfile) {

	var lineDelimiter = molfile.indexOf("\r\n") > 0 ? "\r\n" : "\n";
	var mol_lines = molfile.split(lineDelimiter);
	var name = mol_lines[0]
	var mol = new jchemhub.model.Molecule(name);
	var atom_count = parseInt(mol_lines[3].substr(0, 3));
	var bond_count = parseInt(mol_lines[3].substr(3, 3));

	for ( var i = 1; i <= atom_count; i++) {
		var line = mol_lines[i + 3];
		var symbol = line.substr(30, 4).replace(/(^\s*)|(\s*$)/g, "");

		var x = parseFloat(line.substr(0, 10));
		var y = parseFloat(line.substr(10, 10));
		// atom.z = parseFloat(line.substr(20, 10));

		// see page 15 of ctfile for details
		// http://www.symyx.com/downloads/public/ctfile/ctfile.pdf
		var ctfile_dd = parseInt(line.substr(34, 2)); // TODO implement
		// isotopic support
		var ctfile_ccc = parseInt(line.substr(36, 3));
		// TODO support old-fashioned M ISO

		var charge = 0;

		if (ctfile_ccc == 0) {
		} else if (ctfile_ccc == 1) {
			charge = 3;
		} else if (ctfile_ccc == 2) {
			charge = 2;
		} else if (ctfile_ccc == 3) {
			charge = 1;
		} else if (ctfile_ccc == 4) {
			// TODO support doublet radical
		} else if (ctfile_ccc == 5) {
			charge = -1;
		} else if (ctfile_ccc == 6) {
			charge = -2;
		} else if (ctfile_ccc == 7) {
			charge = -3;
		}
		var atom = new jchemhub.model.Atom(symbol, x, y, charge);
		mol.addAtom(atom);
	}

	for ( var i = 1; i <= bond_count; i++) {
		var line = mol_lines[i + 3 + atom_count];
		// Don't forget to -1 because molfile numbering from 1 instead of 0

		var sourceAtom = mol.getAtom(parseInt(line.substr(0, 3)) - 1);

		var targetAtom = mol.getAtom(parseInt(line.substr(3, 3)) - 1);

		var bondType = parseInt(line.substr(6, 3));
		var bondStereoType = parseInt(line.substr(9, 3));
		var bond = jchemhub.io.Molfile.BondFactory(bondType, bondStereoType,
				sourceAtom, targetAtom);

		mol.addBond(bond);

	}

	// Read M CHG
	var i = 4 + atom_count + bond_count, il = mol_lines.length;
	var superseded = false;
	while (true) {
		var line = mol_lines[i++];
		if (i == il || line.indexOf("M  END") >= 0) {
			break;
		}
		if (line.indexOf("M  CHG") >= 0) {
			/*
			 * TODO Charge [Generic] M CHGnn8 aaa vvv ... vvv: -15 to +15.
			 * Default of 0 = uncharged atom. When present, this property
			 * supersedes all charge and radical values in the atom block,
			 * forcing a 0 charge on all atoms not listed in an M CHG or M RAD
			 * line.
			 * 
			 */
			if (!superseded) {
				for ( var j = 0, jl = mol.countAtoms(); j < jl; j++) {
					mol.getAtom(j).charge = 0;
				}
				superseded = true;
			}
			var nn = parseInt(line.substr(6, 3));
			for ( var k = 0; k < nn; k++) {
				var atomNum = parseInt(line.substr(10 + 8 * k, 3));
				// console.debug(atomNum);
				var charge = parseInt(line.substr(14 + 8 * k, 3));
				// console.debug(charge);
				mol.getAtom(atomNum - 1).charge = charge;
			}

		}
		// console.debug(line);
	}

	// TODO parse Charge, SuperAtom groups, Properties....

	return mol;

};

/**
 * Static method for writing molfile
 * 
 * @param {jchemhub.model.Molecule}
 *            molecule to write
 */
jchemhub.io.Molfile.write = function(mol) {
	var molFile = new String();
	var headerBlock = new String();
	var countsLine = new String();
	var atomBlock = new String();
	var bondBlock = new String();

	// Header block
	// Line 1: Molecule name
	// Line 2: This line has the format:
	// IIPPPPPPPPMMDDYYHHmmddSSssssssssssEEEEEEEEEEEERRRRRR
	// Line 3: A line for comments. If no comment is entered, a blank line must
	// be present.
	var now = new Date();
	var line1 = mol.name + "\n";
	var fmt = new goog.i18n.DateTimeFormat('mmddyyHHMM');
	var line2 = " " + "JChemHub" + fmt.format(now) + "\n";
	var line3 = "\n";
	var headerBlock = line1 + line2 + line3;

	// Counts line
	var atomCount = (goog.string.repeat(" ", 3) + mol.countAtoms()).slice(-3);
	var bondCount = (goog.string.repeat(" ", 3) + mol.countBonds()).slice(-3);

	// TODO complete lll, fff, ccc, sss
	countsLine = atomCount + bondCount + "  0  0  0  0            999 V2000\n";

	// Atom block
	for (i = 0; i < mol.countAtoms(); i++) {
		var atom = mol.getAtom(i);
		var xPos = (goog.string.repeat(" ", 10) + atom.coord.x.toFixed(4)).slice(-10);
		var yPos = (goog.string.repeat(" ", 10) + atom.coord.y.toFixed(4)).slice(-10);
		var zPos = (goog.string.repeat(" ", 10) + (0).toFixed(4)).slice(-10);
		var atomSymbol = (goog.string.repeat(" ", 3) + atom.symbol).slice(-3);

		// TODO: fill in more details on rest of atom line
		var filler = "  0  0  0  0  0  0  0  0  0  0  0  0";
		atomBlock += xPos + yPos + zPos + atomSymbol + "\n";
	}

	// Bond Block
	for (i = 0; i < mol.countBonds(); i++) {
		var bond = mol.getBond(i);
		var firstAtomNumber = mol.indexOfAtom(bond.source) + 1;
		var firstAtomString = (goog.string.repeat(" ", 3) + firstAtomNumber)
				.slice(-3);
		var secondAtomNumber = mol.indexOfAtom(bond.target) + 1;
		var secondAtomString = (goog.string.repeat(" ", 3) + secondAtomNumber)
				.slice(-3);
		var bondTypeString = (goog.string.repeat(" ", 3) + jchemhub.io.Molfile.getTypeCode(bond))
				.slice(-3);
		var stereoTypeString = (goog.string.repeat(" ", 3) + jchemhub.io.Molfile.getStereoCode(bond))
				.slice(-3);
		bondBlock += firstAtomString + secondAtomString + bondTypeString
				+ stereoTypeString + "\n";
	}

	molFile = headerBlock + countsLine + atomBlock + bondBlock;
	// alert(molFile);
	return molFile;

};

/**
 * Static method for reading rxnfile
 * 
 * @param {String}
 *            rxnfile to read
 */
jchemhub.io.Rxnfile.read = function(rxnfile) {
	var lineDelimiter = rxnfile.indexOf("\r\n") > 0 ? "\r\n" : "\n";
	var rxn_lines = rxnfile.split(lineDelimiter, 5);// only need first 5 lines
	if (rxn_lines[0].indexOf("$RXN") < 0) {
		throw "not a RXN file";
	}
	var reaction = new jchemhub.model.Reaction();
	reaction.header = rxn_lines[2] + lineDelimiter + rxn_lines[3];
	var reactant_count = parseInt(rxn_lines[4].substr(0, 3));
	var product_count = parseInt(rxn_lines[4].substr(3, 3));
	var rxn_blocks = rxnfile.split("$MOL" + lineDelimiter);
	for ( var i = 1, il = reactant_count; i <= il; i++) {
		var mol = jchemhub.io.Molfile.read(rxn_blocks[i]);
		reaction.addReactant(mol);
	}
	for ( var i = 1, il = product_count; i <= il; i++) {
		var mol = jchemhub.io.Molfile.read(rxn_blocks[i + reactant_count]);
		reaction.addProduct(mol);
	}
	return reaction;

};

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
	if (btype == jchemhub.model.Bond.BondType.Single) {
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
jchemhub.io.JSONMolecule.write = function(mol) {
	return mol.toString();
}

/**
 * Static method for reading JSON representation of reaction object. import data
 * into reaction object
 * 
 * @param {Object}
 *            The JSON object string, or object itself
 */
jchemhub.io.JSONReaction.read = function(arg) {
	var jrxn;
	if (arg.constructor == String) {
		jrxn = JSON.parse(arg);
	} else {
		jrxn = arg;
	}
	var rxn = new jchemhub.model.Reaction();
	rxn.header = jrxn.header;
	for (var i in jrxn.reactants) {
		rxn.reactants.push(jchemhub.io.JSONMolecule.read(jrxn.reactants[i]));
	}
	for (var i in jrxn.products) {
		rxn.products.push(jchemhub.io.JSONMolecule.read(jrxn.products[i]));
	}
	return rxn;
}

/**
 * export data from reaction object
 * returns The JSON representation of reaction object.
 */
jchemhub.model.Reaction.prototype.toString = function () {
	var jstring = '{"header":"' + this.header + '"';
	jstring += ', "reactants":[';
	for (i in this.reactants) {
		jstring += this.reactants[i].toString() + ',';
	}
	jstring += ']';
	jstring += ', "products":[';
	for (var i in this.products) {
		jstring += this.products[i].toString() + ',';
	}
	jstring += ']';
	
	jstring += '}';
	return jstring;
};
jchemhub.io.JSONReaction.write = function(rxn) {
	return rxn.toString();
};