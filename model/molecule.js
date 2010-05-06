goog.provide('jchemhub.model.Molecule');
goog.require('goog.array');
goog.require('jchemhub.ring.RingFinder');

/**
 * Class representing a Molecule
 * 
 * @param {string=} opt_name, Name of molecule, defaults to empty string.
 * @constructor
 */
jchemhub.model.Molecule = function(opt_name) {
	/**
	 * bonds belonging to this molecule
	 * 
	 * @type {Array.<jchemhub.model.Bond>}
	 * 
	 */
	this.bonds = [];
	
	/** 
	 * atoms belonging to this molecule
	 * 
	 * @type {Array.<jchemhub.model.Atom>}
	 */
	this.atoms = [];
	
	/**
	 * name of molecule
	 * 
	 * @type {string}
	 */
	this.name = "";
	
	/**
	 * rings found in this molecule
	 * 
	 * @type {Array.<jchemhub.ring.Ring>}
	 */
	this.rings = [];
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
	this.findRings();
};

/**
 * Get the atom of given id.
 * 
 * @param {number}
 *            id The atom id.
 * @return {jchemhub.model.Atom}
 */

jchemhub.model.Molecule.prototype.getAtom = function(id) {
	return this.atoms[id];
};

/**
 * Get the bond of given id.
 * 
 * @param {number}
 *            id The bond id.
 * @return {jchemhub.model.Bond}
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
 * @return{jchemhub.model.Bond}
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
 * @return{jchemhub.model.number}
 */
jchemhub.model.Molecule.prototype.indexOfAtom = function(atom) {
	return goog.array.indexOf(this.atoms, atom);
};

/**
 * Return id of given bond. If not found, return -1;
 * 
 * @param {jchemhub.model.Bond}
 *            bond The bond to lookup.
 * @return{jchemhub.model.number}
 */
jchemhub.model.Molecule.prototype.indexOfBond = function(bond) {
	return goog.array.indexOf(this.bonds, bond);
};

/**
 * Remove a atom from molecule.
 * 
 * @param {number|jchemhub.model.Atom}
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
	this.findRings();

};

/**
 * Remove a bond from molecule.
 * 
 * @param {number|jchemhub.model.Bond}
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
	this.findRings();
};

/**
 * Count atoms.
 * @return{number}
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

/**
 * Add an atom to molecule.
 * 
 * @param {jchemhub.model.Atom}
 *            atom The atom to add.
 */
jchemhub.model.Molecule.prototype.addAtom = function(atom) {
	this.atoms.push(atom);
	this.findRings();
};

jchemhub.model.Molecule.prototype.findRings = function(){
	this.rings = jchemhub.ring.RingFinder.findRings(this);
}
