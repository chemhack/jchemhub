goog.provide('jchemhub.model.SingleBond');
goog.require('jchemhub.model.Bond');

/**
 * Class representing a Single Bond
 * @param {jchemhub.model.Atom} source Atom at one end of bond.
 * @param {jchemhub.model.Atom} target Atom at other end of bond.
 * @constructor
 * @extends {jchemhub.model.Bond}
 */
jchemhub.model.SingleBond = function(source, target){
	jchemhub.model.Bond.call(this, source, target);
}
goog.inherits(jchemhub.model.SingleBond, jchemhub.model.Bond);

/**
 * static value for order of this type of bond
 * @type{number}
 */
jchemhub.model.SingleBond.ORDER = 1;