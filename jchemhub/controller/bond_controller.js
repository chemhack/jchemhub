goog.provide('jchemhub.controller.BondController');
goog.provide('jchemhub.controller.BondController.BondEvent');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.controller.BondController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);
};
goog.inherits(jchemhub.controller.BondController, goog.events.EventTarget);

jchemhub.controller.BondController.prototype.handleMouseOver = function(bond, e) {

	this.dispatchEvent(new jchemhub.controller.BondController.BondEvent(this,
			bond, jchemhub.controller.BondController.EventType.MOUSEOVER));
};

jchemhub.controller.BondController.prototype.handleMouseOut = function(bond, e) {
	this.dispatchEvent(jchemhub.controller.BondController.EventType.MOUSEOUT);
};

jchemhub.controller.BondController.prototype.handleMouseDown = function(bond, e) {
	this.dispatchEvent(new jchemhub.controller.BondController.BondEvent(this,
			bond, jchemhub.controller.BondController.EventType.MOUSEDOWN));
};

/** @enum {string} */
jchemhub.controller.BondController.EventType = {
	MOUSEOVER : 'bond_mouseover',
	MOUSEOUT : 'bond_mouseout',
	MOUSEDOWN : 'bond_mousedown'
};

/**
 * 
 * @param {jchemhub.controller.BondController} controller
 * @param {jchemhub.model.Bond} bond
 * @param {jchemhub.controller.BondController.EventType} type
 * @constructor
 * @extends {goog.events.Event}
 */
jchemhub.controller.BondController.BondEvent = function(controller, bond, type) {
	goog.events.Event.call(this, type, controller);
	this.bond = bond;
};
goog.inherits(jchemhub.controller.BondController.BondEvent, goog.events.Event);
