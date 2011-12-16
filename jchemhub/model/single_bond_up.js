goog.provide('jchemhub.model.SingleBondUp');
goog.require('jchemhub.model.SingleBond');

/**
 * Class representing a Single Bond with Up sterochemistry
 * @param {jchemhub.model.Atom} source Atom at one end of bond.
 * @param {jchemhub.model.Atom} target Atom at other end of bond.
 * @constructor
 * @extends {jchemhub.model.SingleBond}
 */
jchemhub.model.SingleBondUp = function(source, target){
	jchemhub.model.SingleBond.call(this, source, target);
}
goog.inherits(jchemhub.model.SingleBondUp, jchemhub.model.SingleBond);
/**
 * static value for order of this type of bond
 * @type{number}
 */
jchemhub.model.SingleBondUp.ORDER = 1;