goog.provide('jchemhub.controller.plugins.ClearEditor');

goog.require('jchemhub.controller.Plugin');
goog.require('goog.functions');

goog.exportSymbol('jchemhub.controller.plugins.ClearEditor.COMMAND',
		jchemhub.controller.plugins.ClearEditor.COMMAND);

/**
 * simple Plugin for clearing editor.
 * 
 * @constructor
 * @extends {jchemhub.controller.Plugin}
 */
jchemhub.controller.plugins.ClearEditor = function() {
	jchemhub.controller.Plugin.call(this);
};
goog.inherits(jchemhub.controller.plugins.ClearEditor,
		jchemhub.controller.Plugin);

/** The clear command. */
jchemhub.controller.plugins.ClearEditor.COMMAND = 'clearEditor';

/** @inheritDoc */
jchemhub.controller.plugins.ClearEditor.prototype.getTrogClassId = goog.functions
		.constant(jchemhub.controller.plugins.ClearEditor.COMMAND);

/** @inheritDoc */
jchemhub.controller.plugins.ClearEditor.prototype.isSupportedCommand = function(
		command) {
	return command == jchemhub.controller.plugins.ClearEditor.COMMAND;
};

/**
 * clears the editor.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
jchemhub.controller.plugins.ClearEditor.prototype.execCommandInternal = function(
		command) {
	this.editorObject.clear();
};
