
goog.provide('jchemhub.controller.plugins.SelectorRectangle');
goog.require('jchemhub.controller.Plugin');
goog.require('goog.functions');
goog.require('goog.debug.Logger');


/**
 * simple Plugin for highlighting bonds and atoms
 *
 * @constructor
 * @extends {jchemhub.controller.Plugin}
 */
jchemhub.controller.plugins.SelectorRectangle = function() {
  jchemhub.controller.Plugin.call(this);
};
goog.inherits(jchemhub.controller.plugins.SelectorRectangle, jchemhub.controller.Plugin);

/**
 * Commands supported 
 * @enum {string}
 */
jchemhub.controller.plugins.SelectorRectangle.COMMAND = {
		MOUSEDOWN: 'mousedown',
		MOUSEUP: 'mouseup'
};

/**
 * Inverse map of execCommand strings to
 * {@link jchemhub.controller.plugins.SelectorRectangle.COMMAND} constants. Used to
 * determine whether a string corresponds to a command this plugin handles
 * @type {Object}
 * @private
 */
jchemhub.controller.plugins.SelectorRectangle.SUPPORTED_COMMANDS_ =
    goog.object.transpose(jchemhub.controller.plugins.SelectorRectangle.COMMAND);


/**
 * Whether the string corresponds to a command this plugin handles.
 * @param {string} command Command string to check.
 * @return {boolean} Whether the string corresponds to a command
 *     this plugin handles.
 */
jchemhub.controller.plugins.SelectorRectangle.prototype.isSupportedCommand =
    function(command) {
  return command in jchemhub.controller.plugins.SelectorRectangle.SUPPORTED_COMMANDS_;
};

/** @inheritDoc */
jchemhub.controller.plugins.SelectorRectangle.prototype.getTrogClassId =
    goog.functions.constant('jchemhub.controller.plugins.SelectorRectangle');

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.SelectorRectangle.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.SelectorRectangle');


jchemhub.controller.plugins.SelectorRectangle.prototype.handleMouseDown = function(e) {
	this.logger.info('handleMouseDown');
};


