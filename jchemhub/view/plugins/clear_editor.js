
goog.provide('jchemhub.view.plugins.ClearEditor');

goog.require('jchemhub.view.Plugin');
goog.require('goog.functions');


/**
 * simple Plugin for clearing editor.
 *
 * @constructor
 * @extends {jchemhub.view.Plugin}
 */
jchemhub.view.plugins.ClearEditor = function() {
  jchemhub.view.Plugin.call(this);
};
goog.inherits(jchemhub.view.plugins.ClearEditor, jchemhub.view.Plugin);


/** The clear command. */
jchemhub.view.plugins.ClearEditor.COMMAND = 'clearEditor';


/** @inheritDoc */
jchemhub.view.plugins.ClearEditor.prototype.getTrogClassId =
    goog.functions.constant(jchemhub.view.plugins.ClearEditor.COMMAND);


/** @inheritDoc */
jchemhub.view.plugins.ClearEditor.prototype.isSupportedCommand = function(
    command) {
  return command == jchemhub.view.plugins.ClearEditor.COMMAND;
};


/**
 * clears the editor.
 * @param {string} command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
jchemhub.view.plugins.ClearEditor.prototype.execCommandInternal = function(
    command) {
	console.log('clear');
	this.editorObject.clear();
};
