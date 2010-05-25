goog.provide('jchemhub.model.Bond');
goog.require('jchemhub.model.Atom');

/**
 * Base class representing a Bond
 * 
 * @param {jchemhub.model.Atom}
 *            source, Atom at one end of bond.
 * @param {jchemhub.model.Atom}
 *            target, Atom at other end of bond.
 * @constructor
 */
jchemhub.model.Bond = function(source, target, opt_molecule) {
	/**
	 * source Atom
	 * 
	 * @type {jchemhub.model.Atom}
	 */
	this.source = source;
	/**
	 * target Atom
	 * 
	 * @type{jchemhub.model.Atom}
	 */
	this.target = target;
	
	if(opt_molecule){
		this.molecule = molecule;
	}
};

