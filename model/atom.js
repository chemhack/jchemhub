//Licence and copyright

goog.provide('jchemhub.model.Atom');
goog.require('goog.structs.Set');




/**
 * Creates a new Atom.
 * @constructor
 */
jchemhub.model.Atom=function(symbol)
{
    this.symbol = symbol;
    this.x=0;
	this.y=0;
	this.z=0;
	this.bonds=new goog.structs.Set();
    this.charge=0;
};

jchemhub.model.Atom.prototype.countBonds = function() {
	return this.bonds.getCount();	
};




