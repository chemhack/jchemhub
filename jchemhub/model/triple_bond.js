goog.provide('jchemhub.model.TripleBond');
goog.require('jchemhub.model.Bond');

/**
 * Class representing a Triple Bond
 * @param {jchemhub.model.Atom} source Atom at one end of bond.
 * @param {jchemhub.model.Atom} target Atom at other end of bond.
 * @constructor
 * @extends {jchemhub.model.Bond}
 */
jchemhub.model.TripleBond = function(source, target){
	jchemhub.model.Bond.call(this, source, target);
}
goog.inherits(jchemhub.model.TripleBond, jchemhub.model.Bond);

/**
 * static value for order of this type of bond
 * @type{number}
 */
jchemhub.model.TripleBond.ORDER = 3;