
goog.provide('jchemhub.model.PseudoAtom');
goog.require('jchemhub.model.Atom');

/**
 * Class representing a pseudo atom (*, RGroup etc) 
 * 
 * @param {string}
 *            _label, text label for the PseudoAtom (like R1, R10 or what u like) 
 * @param {number}
 *            x, X-coordinate of atom.
 * @param {number}
 *            y, Y-coordinate of atom.
 * @constructor
 * @extends {jchemhub.model.Atom}
 */

jchemhub.model.PseudoAtom=function(_label, x, y) {

	jchemhub.model.Atom.call(this,"R",x,y); //?

    this.label="";
    if (_label==null)
	   this.label="*";
	else
	   this.label = _label;
}

goog.inherits(jchemhub.model.PseudoAtom, jchemhub.model.Atom);  

