
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

/**
 * Commands supported 
 * @enum {string}
 */
jchemhub.view.plugins.SelectorRectangle.COMMAND = {
		MOUSEDOWN: 'mousedown',
		MOUSEUP: 'mouseup'
};

/**
 * Inverse map of execCommand strings to
 * {@link jchemhub.view.plugins.SelectorRectangle.COMMAND} constants. Used to
 * determine whether a string corresponds to a command this plugin handles
 * @type {Object}
 * @private
 */
jchemhub.view.plugins.SelectorRectangle.SUPPORTED_COMMANDS_ =
    goog.object.transpose(jchemhub.view.plugins.SelectorRectangle.COMMAND);


/**
 * Whether the string corresponds to a command this plugin handles.
 * @param {string} command Command string to check.
 * @return {boolean} Whether the string corresponds to a command
 *     this plugin handles.
 */
jchemhub.view.plugins.SelectorRectangle.prototype.isSupportedCommand =
    function(command) {
  return command in jchemhub.view.plugins.SelectorRectangle.SUPPORTED_COMMANDS_;
};

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


jchemhub.view.plugins.SelectorRectangle.prototype.handleMouseDown = function(e) {
	this.logger.info('handleMouseDown');
};


