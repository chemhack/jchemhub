
goog.provide('jchemhub.view.plugins.SelectorRectangle');
goog.require('jchemhub.view.Plugin');
goog.require('goog.functions');
goog.require('goog.debug.Logger');


/**
 * simple Plugin for highlighting bonds and atoms
 *
 * @constructor
 * @extends {jchemhub.view.Plugin}
 */
jchemhub.view.plugins.SelectorRectangle = function() {
  jchemhub.view.Plugin.call(this);
};
goog.inherits(jchemhub.view.plugins.SelectorRectangle, jchemhub.view.Plugin);



/** @inheritDoc */
jchemhub.view.plugins.SelectorRectangle.prototype.getTrogClassId =
    goog.functions.constant('jchemhub.view.plugins.SelectorRectangle');

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.plugins.SelectorRectangle.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.plugins.SelectorRectangle');


jchemhub.view.plugins.SelectorRectangle.prototype.handleBondMouseDown = function(e) {
	this.logger.info('handleBondMouseDown');
};


