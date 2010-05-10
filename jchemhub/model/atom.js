//Licence and copyright

goog.provide('jchemhub.model.Atom');
goog.require('goog.structs.Set');
goog.require('goog.math.Coordinate');

/**
 * Class representing an atom
 * 
 * @param {string}
 *            symbol, Atom symbol
 * @param {number}
 *            x, X-coordinate of atom.
 * @param {number}
 *            y, Y-coordinate of atom.
 * @param {number}
 *            opt_charge, Charge of atom, defaults to 0.
 * @constructor
 */
jchemhub.model.Atom=function(symbol, x, y, opt_charge)
{
	/**
	 * Atom symbol
	 * 
	 * @type {string}
	 */
    this.symbol = symbol;
    
    /**
     * 2d coordinates 
     * @type{goog.math.Coordinate}
     */
    this.coord = new goog.math.Coordinate(x,y);
    /**
     * Bonds belonging to this atom
     * @type{goog.structs.Set}
     */
	this.bonds=new goog.structs.Set();
	/**
	 * charge
	 * @type{number} 
	 */
    this.charge = goog.isDef(opt_charge) ? opt_charge : 0;
};

jchemhub.model.Atom.prototype.countBonds = function() {
	return this.bonds.getCount();	
};







