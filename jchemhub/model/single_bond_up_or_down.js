goog.provide('jchemhub.model.SingleBondUpOrDown');
goog.require('jchemhub.model.SingleBond');

/**
 * Class representing a Single Bond with Up or Down stereo-chemistry
 * @param {jchemhub.model.Atom} source Atom at one end of bond.
 * @param {jchemhub.model.Atom} target Atom at other end of bond.
 * @constructor
 * @extends {jchemhub.model.SingleBond}
 */
jchemhub.model.SingleBondUpOrDown = function(source, target){
	jchemhub.model.SingleBond.call(this, source, target);
}
goog.inherits(jchemhub.model.SingleBondUpOrDown, jchemhub.model.SingleBond);	
/**
 * static value for order of this type of bond
 * @type{number}
 */
jchemhub.model.SingleBondUpOrDown.ORDER = 1;