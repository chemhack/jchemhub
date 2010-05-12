//Licence and copyright

goog.provide('jchemhub.model.Atom');
goog.provide('jchemhub.model.Atom.Hybridizations');
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

    this.hybridization=null;
};

jchemhub.model.Atom.prototype.countBonds = function() {
	return this.bonds.getCount();	
};


/**
 * Hybridization states
 * @enum {number}
 */
jchemhub.model.Atom.Hybridizations = {
        S      :0,
        SP1    :1,     // linear
        SP2    :2,     // trigonal planar (single pi-electron in pz)
        SP3    :3,     // tetrahedral
        PLANAR3:4,     // trigonal planar (lone pair in pz)
        SP3D1  :5,     // trigonal planar
        SP3D2  :6,     // octahedral
        SP3D3  :7,     // pentagonal bipyramid
        SP3D4  :8,     // square antiprim
        SP3D5  :9      // tricapped trigonal prism
};






