goog.provide('jchemhub.model.Molecule');
goog.require('goog.array');

/**
 * Creates a new Molecule.
 * 
 * @constructor
 */
jchemhub.model.Molecule = function() {
	this.bonds = new Array();
	this.atoms = new Array();
	this.name = new String();
};

/**
 * Add a bond to molecule.
 * 
 * @param {jchemhub.model.Bond} bond The bond to add.
 */

jchemhub.model.Molecule.prototype.addBond = function(bond) {
	this.bonds.push(bond);
	bond.source.bonds.add(bond);
	bond.target.bonds.add(bond);
};

/**
 * Get the atom of given id.
 * 
 * @param {number}
 *            id The atom id.
 */

jchemhub.model.Molecule.prototype.getAtom = function(id) {
	return this.atoms[id];
};

/**
 * Get the bond of given id.
 * 
 * @param {number}
 *            id The bond id.
 */

jchemhub.model.Molecule.prototype.getBond = function(id) {
	return this.bonds[id];
};

/**
 * Find the bond between two given atoms if it exists. Otherwise return null.
 * 
 * @param {Object}
 *            atom1
 * @param {Object}
 *            atom2
 */
jchemhub.model.Molecule.prototype.findBond = function(atom1, atom2) {
	for ( var i = 0, il = this.bonds.length; i < il; i++) {
		var bond = this.bonds[i];
		if ((atom1 == bond.source && atom2 == bond.target)
				|| (atom2 == bond.source && atom1 == bond.target))
			return bond;
	}
	return null;
};

/**
 * Return id of given atom. If not found, return -1;
 * 
 * @param {jchemhub.model.Atom}
 *            atom The atom to lookup.
 */
jchemhub.model.Molecule.prototype.indexOfAtom = function(atom) {
	return goog.array.indexOf(this.atoms, atom);
};

/**
 * Return id of given bond. If not found, return -1;
 * 
 * @param {jchemhub.model.Bond}
 *            bond The bond to lookup.
 */
jchemhub.model.Molecule.prototype.indexOfBond = function(bond) {
	return goog.array.indexOf(this.bonds, bond);
};

/**
 * Remove a atom from molecule.
 * 
 * @param atomOrId
 *            Instance or id of the atom to remove.
 */

jchemhub.model.Molecule.prototype.removeAtom = function(atomOrId) {
	var atom;
	if (atomOrId.constructor == Number) {
		atom = this.atoms[atomOrId];
	} else if (atomOrId.constructor == jchemhub.model.Atom) {
		atom = atomOrId;
	}
	var neighborBonds = atom.bonds.getValues();
	var molBonds = this.bonds; // for bond reference in anonymous method
	goog.array.forEach(neighborBonds, function(element, index, array) {
		goog.array.remove(molBonds, element);
	});
	atom.bonds.clear();
	goog.array.remove(this.atoms, atom);

};

/**
 * Remove a bond from molecule.
 * 
 * @param bondOrId
 *            Instance or id of the bond to remove.
 */

jchemhub.model.Molecule.prototype.removeBond = function(bondOrId) {
	var bond;
	if (bondOrId.constructor == Number) {
		bond = this.bonds[bondOrId];
	} else if (bondOrId.constructor == jchemhub.model.Bond) {
		bond = bondOrId;
	}
	bond.source.bonds.remove(bond);
	bond.target.bonds.remove(bond);
	goog.array.remove(this.bonds, bond);
};

/**
 * Count atoms.
 */
jchemhub.model.Molecule.prototype.countAtoms = function() {
	return this.atoms.length;
};

/**
 * Count bonds.
 */
jchemhub.model.Molecule.prototype.countBonds = function() {
	return this.bonds.length;
};

jchemhub.model.Molecule.prototype.setName = function(_name) {
	this.name = _name;
};

jchemhub.model.Molecule.prototype.getName = function() {
	return this.name;
};

/**
 * Add an atom to molecule.
 * 
 * @param {jchemhub.model.Atom}
 *            atom The atom to add.
 */
jchemhub.model.Molecule.prototype.addAtom = function(atom) {
	this.atoms.push(atom);
};
