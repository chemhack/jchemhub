goog.provide('jchemhub.controller.Plugin');
goog.require('goog.events.EventTarget');
goog.require('goog.functions');
goog.require('goog.debug.Logger');
goog.require('goog.object');
goog.require('goog.reflect');

/**
 * Abstract API for reaction editor plugins.
 * 
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.controller.Plugin = function() {
	goog.events.EventTarget.call(this);

	/**
	 * Whether this plugin is enabled for the registered field object.
	 * 
	 * @type {boolean}
	 * @private
	 */
	this.enabled_ = this.activeOnUneditableEditor();
};
goog.inherits(jchemhub.controller.Plugin, goog.events.EventTarget);

/**
 * @return {boolean} If true, editor will not disable the command when the
 *         editor becomes uneditable.
 */
jchemhub.controller.Plugin.prototype.activeOnUneditableEditor = goog.functions.FALSE;

/**
 * Registers the reaction editor object for use with this plugin.
 * 
 * @param {jchemhub.controller.ReactionEditor}
 *            fieldObject The reaction editor object.
 */
jchemhub.controller.Plugin.prototype.registerEditorObject = function(editorObject) {
	this.editorObject = editorObject;
};

/**
 * Enables this plugin for the specified, registered reaction editor object. A
 * reaction editor object should only be enabled when it is loaded.
 * 
 * @param {jchemhub.controller.ReactionEditor}
 *            editorObject The field object.
 */
jchemhub.controller.Plugin.prototype.enable = function(editorObject) {
	if (this.editorObject == editorObject) {
		this.enabled_ = true;
	} else {
		this.logger
				.severe('Trying to enable an unregistered field with ' + 'this plugin.');
	}
};

/**
 * Disables this plugin for the specified, registered reaction editor object.
 * 
 * @param {jchemhub.controller.ReactionEditor}
 *            editorObject The reaction editor object.
 */
jchemhub.controller.Plugin.prototype.disable = function(editorObject) {
	if (this.editorObject == editorObject) {
		this.enabled_ = false;
	} else {
		this.logger
				.severe('Trying to disable an unregistered field ' + 'with this plugin.');
	}
};

/**
 * The logger for this plugin.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.Plugin.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.Plugin');

/**
 * Returns whether this plugin is enabled for the reaction editor object.
 * 
 * @param {jchemhub.controller.ReactionEditor}
 *            editorObject The reaction editor object.
 * @return {boolean} Whether this plugin is enabled for the reaction editor
 *         object.
 */
jchemhub.controller.Plugin.prototype.isEnabled = function(editorObject) {
	return this.editorObject == editorObject ? this.enabled_ : false;
};

/** @inheritDoc */
jchemhub.controller.Plugin.prototype.disposeInternal = function() {
	if (this.editorObject) {
		this.unregisterEditorObject(this.editorObject);
	}

	jchemhub.controller.Plugin.superClass_.disposeInternal.call(this);
};

/**
 * Unregisters and disables this plugin for the current editor object.
 * 
 */
jchemhub.controller.Plugin.prototype.unregisterEditorObject = function() {
	if (this.editorObject) {
		this.disable(this.editorObject);
		this.editorObject = null;
	}
};

/**
 * Indicates if this plugin should be automatically disposed when the registered
 * editor is disposed. This should be changed to false for plugins used as
 * multi-editor plugins.
 * 
 * @type {boolean}
 * @private
 */
jchemhub.controller.Plugin.prototype.autoDispose_ = true;

/**
 * Set if this plugin should automatically be disposed when the registered
 * editor is disposed.
 * 
 * @param {boolean}
 *            autoDispose Whether to autoDispose.
 */
jchemhub.controller.Plugin.prototype.setAutoDispose = function(autoDispose) {
	this.autoDispose_ = autoDispose;
};

/**
 * @return {boolean} Whether or not this plugin should automatically be disposed
 *         when it's registered edtior is disposed.
 */
jchemhub.controller.Plugin.prototype.isAutoDispose = function() {
	return this.autoDispose_;
};

/**
 * An enum of operations that plugins may support.
 * 
 * @enum {number}
 */
jchemhub.controller.Plugin.Op = {
	KEYDOWN : 1,
	KEYPRESS : 2,
	KEYUP : 3,
	SELECTION : 4,
	SHORTCUT : 5,
	EXEC_COMMAND : 6,
	QUERY_COMMAND : 7,
	MOUSEDOWN: 8,
	MOUSEUP: 9,
	MOUSEOVER: 10, 
	MOUSEOUT: 11,
	ATOM_MOUSEOVER : 12,
	ATOM_MOUSEOUT : 13,
	BOND_MOUSEOVER : 14,
	BOND_MOUSEOUT : 15,
	BOND_MOUSEDOWN: 16
};

/**
 * @return {boolean} If true, editor will not disable the command
 *     when the field becomes uneditable.
 */
jchemhub.controller.Plugin.prototype.activeOnUneditableEditors = goog.functions.FALSE;

/**
 * A map from plugin operations to the names of the methods that invoke those
 * operations.
 */
jchemhub.controller.Plugin.OPCODE = goog.object.transpose(goog.reflect.object(
		jchemhub.controller.Plugin, {
			handleKeyDown : jchemhub.controller.Plugin.Op.KEYDOWN,
			handleKeyPress : jchemhub.controller.Plugin.Op.KEYPRESS,
			handleKeyUp : jchemhub.controller.Plugin.Op.KEYUP,
			handleSelectionChange : jchemhub.controller.Plugin.Op.SELECTION,
			handleKeyboardShortcut : jchemhub.controller.Plugin.Op.SHORTCUT,
			execCommand : jchemhub.controller.Plugin.Op.EXEC_COMMAND,
			queryCommandValue : jchemhub.controller.Plugin.Op.QUERY_COMMAND,
			handleMouseDown : jchemhub.controller.Plugin.Op.MOUSEDOWN,
			handleMouseUp : jchemhub.controller.Plugin.Op.MOUSEUP,
			handleMouseOver : jchemhub.controller.Plugin.Op.MOUSEOVER,
			handleMouseOut : jchemhub.controller.Plugin.Op.MOUSEOUT,
			handleAtomMouseOver : jchemhub.controller.Plugin.Op.ATOM_MOUSEOVER,
			handleAtomMouseOut : jchemhub.controller.Plugin.Op.ATOM_MOUSEOUT,
			handleBondMouseOver : jchemhub.controller.Plugin.Op.BOND_MOUSEOVER,
			handleBondMouseOut : jchemhub.controller.Plugin.Op.BOND_MOUSEOUT,
			handleBondMouseDown : jchemhub.controller.Plugin.Op.BOND_MOUSEDOWN
		}));

/**
 * Handles execCommand. This default implementation handles dispatching
 * BEFORECHANGE, CHANGE, and SELECTIONCHANGE events, and calls
 * execCommandInternal to perform the actual command. Plugins that want to do
 * their own event dispatching should override execCommand, otherwise it is
 * preferred to only override execCommandInternal.
 * 
 * This version of execCommand will only work for single field plugins.
 * Multi-field plugins must override execCommand.
 * 
 * @param {string}
 *            command The command to execute.
 * @param {...*}
 *            var_args Any additional parameters needed to execute the command.
 * @return {*} The result of the execCommand, if any.
 */
jchemhub.controller.Plugin.prototype.execCommand = function(command, var_args) {
	// TODO: Replace all uses of isSilentCommand with plugins that just
	// override this base execCommand method.
	var silent = this.isSilentCommand(command);
	if (!silent) {
		// Stop listening to mutation events in Firefox while text formatting
		// is happening. This prevents us from trying to size the field in the
		// middle of an execCommand, catching the field in a strange
		// intermediary
		// state where both replacement nodes and original nodes are appended to
		// the dom. Note that change events get turned back on by
		// editorObject.dispatchChange.
		if (goog.userAgent.GECKO) {
			this.editorObject.stopChangeEvents(true, true);
		}

		this.editorObject.dispatchBeforeChange();
	}

	try {
		var result = this.execCommandInternal.apply(this, arguments);
	} finally {
		// If the above execCommandInternal call throws an exception, we still
		// need
		// to turn change events back on (see http://b/issue?id=1471355).
		// NOTE: If if you add to or change the methods called in this finally
		// block, please add them as expected calls to the unit test function
		// testExecCommandException().
		if (!silent) {
			// dispatchChange includes a call to startChangeEvents, which
			// unwinds the
			// call to stopChangeEvents made before the try block.
			this.editorObject.dispatchChange();

			this.editorObject.dispatchSelectionChangeEvent();

		}
	}

	return result;
};

/**
 * @param {string}
 *            command The command to check.
 * @return {boolean} If true, field will not dispatch change events for commands
 *         of this type.
 */
jchemhub.controller.Plugin.prototype.isSilentCommand = goog.functions.FALSE;

/**
 * Whether the string corresponds to a command this plugin handles.
 * 
 * @param {string}
 *            command Command string to check.
 * @return {boolean} Whether the plugin handles this type of command.
 */
jchemhub.controller.Plugin.prototype.isSupportedCommand = function(command) {
	return false;
};
