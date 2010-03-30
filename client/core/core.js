//Licence and copyright

goog.provide('chem.core.Atom');
goog.provide('chem.core.Bond');
goog.provide('chem.core.Molecule');

goog.require('goog.structs.Set');
goog.require('goog.array');

/**
 * @fileoverview Core classes including Atom, Bond and Molecule
 *
 */

/**
 * Creates a new Molecule.
 * @constructor
 */
chem.core.Molecule=function()
{
    this.bonds = new Array();
    this.atoms = new Array();
	this.name  = new String();
}

/**
 * Creates a new Atom.
 * @constructor
 */
chem.core.Atom=function(symbol)
{
    this.symbol = symbol;
    this.x=0;
	this.y=0;
	this.z=0;
	this.bonds=new goog.structs.Set();
}

chem.core.Atom.prototype.countBonds = function() {
	return this.bonds.length;	
};

/**
 * Creates a new Bond.
 * @constructor
 */
chem.core.Bond=function(sourceAtom,targetAtom,bondType)
{
    this.source=sourceAtom;
    this.target=targetAtom;
	this.bondType=bondType;
	this.stereoType=chem.core.Bond.StereoType.NoStereo;
}

/**
 * Bond Types, values in molfile spec. Values 4 through 8 are for SSS queries only.
 */
chem.core.Bond.BondType={
	Single:1,
	Double:2,
	Tripe:3,
	Aromatic:4,
	SingleOrDouble:5,
	SingleOrAromatic:6,
	DoubleOrAromatic:7,
	Any:8
}

/**
 * Bond StereoTypes, values in molfile spec. 
 */
chem.core.Bond.StereoType={
	Single:{
		NotStereo:0,
		Up:1,
		Down:6,
		Either:4	
	},
	Double:{
		DetectByCoords:0,
		Either:	3		
	}
}

/**
 * Add an atom to molecule.
 * @param {chem.core.Atom} atom The atom to add.
 */
chem.core.Molecule.prototype.addAtom=function(atom){
	this.atoms.push(atom);		
}

/**
 * Add a bond to molecule.
 * @param {chem.core.Bond} bond The atom to add.
 */

chem.core.Molecule.prototype.addBond=function(bond){
	this.bonds.push(bond);
	bond.source.bonds.add(bond);
	bond.target.bonds.add(bond);	
}

/**
 * Get the atom of given id.
 * @param {number} id The atom id.
 */

chem.core.Molecule.prototype.getAtom=function(id){
	return this.atoms[id];	
}

/**
 * Get the bond of given id.
 * @param {number} id The bond id.
 */

chem.core.Molecule.prototype.getBond=function(id){
	return this.bonds[id];	
}

/**
 * Return id of given atom. If not found, return -1;
 * @param {chem.core.Atom} atom The atom to lookup.
 */
chem.core.Molecule.prototype.indexOfAtom=function(atom){
	//Introducing var il will speed the loop up.
	//Please always do that do get better performance.
	//We have to do loops because Array.indexOf() is not supported by IE6.
	/*
	for (var i=0, il=this.atoms.length; i<il; i++) {
		if(this.atoms[i]==atom) return i;
	}	
	return -1;
	*/
	return goog.array.indexOf(this.atoms,atom);
}

/**
 * Return id of given bond. If not found, return -1;
 * @param {chem.core.Bond} bond The bond to lookup.
 */
chem.core.Molecule.prototype.indexOfBond=function(bond){
	/*
	for (var i=0, il=this.bonds.length; i<il; i++) {
		if(this.bonds[i]==bond) return i;
	}	
	return -1;
	*/
	return goog.array.indexOf(this.bonds,bond);
}

/**
 * Remove a atom from molecule.
 * @param atomOrId Instance or id of the atom to remove.
 */

chem.core.Molecule.prototype.removeAtom=function(atomOrId){
	var id;
	if(atomOrId.constructor == Number){
		id=atomOrId;
	}else if(atomOrId.constructor== chem.core.Atom){
		id=this.indexOfAtom(atomOrId);	
	}
	this.atoms.splice(id,1); 
	//Do not use delete array[i]
	//Otherwise Array.length will keep unchanged.
}


/**
 * Remove a bond from molecule.
 * @param bondOrId Instance or id of the bond to remove.
 */

chem.core.Molecule.prototype.removeBond=function(bondOrId){
	var id,bond;
	if(bondOrId.constructor == Number){
		id=bondOrId;
		bond=this.bonds[id];
	}else if(bondOrId.constructor== chem.core.Bond){
		id=this.indexOfBond(bondOrId);	
		bond=bondOrId;
	}
	
	this.bonds.splice(id,1); 
}

/**
 * Count atoms.
 */
chem.core.Molecule.prototype.countAtoms=function(){
	return this.atoms.length;
}

/**
 * Count bonds.
 */
chem.core.Molecule.prototype.countBonds=function(){
	return this.bonds.length;
}


chem.core.Molecule.prototype.setName=function(_name){
    this.name=_name;  
}

chem.core.Molecule.prototype.getName=function(){
    return this.name;  
}

