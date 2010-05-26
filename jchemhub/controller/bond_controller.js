goog.provide('jchemhub.controller.BondController');
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

jchemhub.controller.BondController.prototype.handleMouseOver = function(Bond, e){
	console.log(Bond.symbol);
	this.dispatchEvent(jchemhub.controller.BondController.EventType.MOUSEOVER);
};

jchemhub.controller.BondController.prototype.handleMouseOut = function(Bond, e){
	this.dispatchEvent(jchemhub.controller.BondController.EventType.MOUSEOUT);
};
/** @enum {string} */ 
jchemhub.controller.BondController.EventType = { 
  MOUSEOVER: 'bond_mouseover',
  MOUSEOUT: 'bond_mouseout'
}; 
