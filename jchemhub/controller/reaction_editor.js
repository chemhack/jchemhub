goog.provide("jchemhub.controller.ReactionEditor");
goog.provide("jchemhub.controller.ReactionEditor.EventType");
goog.require("jchemhub.controller.ReactionController");
goog.require("jchemhub.view.ReactionRenderer");
goog.require("jchemhub.view.MoleculeRenderer");
goog.require("goog.graphics");
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.async.Delay');
goog.require('jchemhub.controller.Plugin');




/**
 * A graphical editor for reactions
 * 
 * 
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.controller.ReactionEditor = function(element, opt_config) {
	goog.events.EventTarget.call(this);
	this.originalElement = element;
	this.id = element.id;
	this.editableDomHelper = goog.dom.getDomHelper(element);
	/**
	 * Map of class id to registered plugin.
	 * 
	 * @type {Object}
	 * @private
	 */
	this.plugins_ = {};

	/**
	 * Plugins registered on this field, indexed by the jchemhub.controller.Plugin.Op
	 * that they support.
	 * 
	 * @type {Object.<Array>}
	 * @private
	 */
	this.indexedPlugins_ = {};

	for ( var op in jchemhub.controller.Plugin.OPCODE) {
		this.indexedPlugins_[op] = [];
	}
	this.config = new goog.structs.Map(
			jchemhub.controller.ReactionEditor.defaultConfig);
	if (opt_config) {
		this.config.addAll(opt_config); // merge optional config into
		// defaults
	}

	this.graphics = goog.graphics.createGraphics(element.clientWidth,
			element.clientHeight);

	this.graphics.render(this.originalElement);

	this.reactionController = new jchemhub.controller.ReactionController(this);
	this.reactionRenderer = new jchemhub.view.ReactionRenderer(this.reactionController, this.graphics);
	this.moleculeRenderer = new jchemhub.view.MoleculeRenderer(this, this.graphics);

	// The editor will not listen to change events until it has finished loading
	// this.stoppedEvents_ = {};
	// this.stopEvent(jchemhub.controller.ReactionEditor.EventType.CHANGE);
	// this.stopEvent(jchemhub.controller.ReactionEditor.EventType.DELAYEDCHANGE);
	this.isModified_ = false;
	this.isEverModified_ = false;
	//
	// this.delayedChangeTimer_ = new goog.async.Delay(
	// this.dispatchDelayedChange_,
	// jchemhub.controller.ReactionEditor.DELAYED_CHANGE_FREQUENCY, this);

	/**
	 * @type {goog.events.EventHandler}
	 * @protected
	 */
	this.eventRegister = new goog.events.EventHandler(this);

	// Wrappers around this editor, to be disposed when the editor is disposed.
	this.wrappers_ = [];

	this.handleEditorLoad();

	this.loadState_ = jchemhub.controller.ReactionEditor.LoadState_.EDITABLE;

	this.isModified_ = false;
	this.isEverModified_ = false;

};
goog.inherits(jchemhub.controller.ReactionEditor, goog.events.EventTarget);

/**
 * List of mutation events in Gecko browsers.
 * 
 * @type {Array.<string>}
 * @protected
 */
jchemhub.controller.ReactionEditor.MUTATION_EVENTS_GECKO = [ 'DOMNodeInserted',
		'DOMNodeRemoved', 'DOMNodeRemovedFromDocument',
		'DOMNodeInsertedIntoDocument', 'DOMCharacterDataModified' ];

/**
 * Sets the active editor id.
 * 
 * @param {?string}
 *            editorId The active editor id.
 */
jchemhub.controller.ReactionEditor.setActiveEditorId = function(editorId) {
	jchemhub.controller.ReactionEditor.activeEditorId_ = editorId;
};

/**
 * @return {goog.dom.DomHelper?} The dom helper for the editable node.
 */
jchemhub.controller.ReactionEditor.prototype.getEditableDomHelper = function() {
	return this.editableDomHelper;
};

/**
 * @return {?string} The id of the active editor.
 */
jchemhub.controller.ReactionEditor.getActiveEditorId = function() {
	return jchemhub.controller.ReactionEditor.activeEditorId_;
};

jchemhub.controller.ReactionEditor.prototype.clear = function() {
	this.graphics.clear();
	this.model = null;
	var fill = new goog.graphics.SolidFill(this.config.get("background").color);

	this.graphics.drawRect(0, 0, this.graphics.getSize().width, this.graphics
			.getSize().height, null, fill);
}

jchemhub.controller.ReactionEditor.prototype.getScaleFactor = function(){
	return this.reactionRenderer.scale_factor;
}

jchemhub.controller.ReactionEditor.prototype.setScaleFactor = function(scale){
	this.reactionRenderer.scale_factor = scale;
}

jchemhub.controller.ReactionEditor.prototype.setModel = function(model) {
	this.clear();
	this.model = model;
	this.render();
}

jchemhub.controller.ReactionEditor.prototype.render = function() {
	if (this.model instanceof jchemhub.model.Reaction) {
		this.reactionRenderer.render(this.model);
	}
	if (this.model instanceof jchemhub.model.Molecule) {
		this.moleculeRenderer.render(this.model);
	}
}

/**
 * gets model
 * 
 * @return{jchemhub.model.Reaction | jchemhub.model.Molecule}
 */
jchemhub.controller.ReactionEditor.prototype.getModel = function() {
	return this.model;
};

/**
 * This dispatches the beforechange event on the editable reaction editor
 */
jchemhub.controller.ReactionEditor.prototype.dispatchBeforeChange = function() {
	this.logger.info('dispatchBeforeChange');
	// if (this
	// .isEventStopped(jchemhub.controller.ReactionEditor.EventType.BEFORECHANGE)) {
	// return;
	// }

	this.dispatchEvent(jchemhub.controller.ReactionEditor.EventType.BEFORECHANGE);
};
//
// /**
// * Checks if the event of the given type has stopped being dispatched
// *
// * @param {goog.editor.Field.EventType}
// * eventType type of event to check.
// * @return {boolean} true if the event has been stopped with stopEvent().
// * @protected
// */
// jchemhub.controller.ReactionEditor.prototype.isEventStopped = function(eventType) {
// return !!this.stoppedEvents_[eventType];
// };

/**
 * Calls all the plugins of the given operation, in sequence, with the given
 * arguments. This is short-circuiting: once one plugin cancels the event, no
 * more plugins will be invoked.
 * 
 * @param {jchemhub.controller.Plugin.Op}
 *            op A plugin op.
 * @param {...*}
 *            var_args The arguments to the plugin.
 * @return {boolean} True if one of the plugins cancel the event, false
 *         otherwise.
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.invokeShortCircuitingOp_ = function(op,
		var_args) {
	var plugins = this.indexedPlugins_[op];
	var argList = goog.array.slice(arguments, 1);
	for ( var i = 0; i < plugins.length; ++i) {
		// If the plugin returns true, that means it handled the event and
		// we shouldn't propagate to the other plugins.
		var plugin = plugins[i];
		if ((plugin.isEnabled(this) || jchemhub.controller.Plugin.IRREPRESSIBLE_OPS[op])
				&& plugin[jchemhub.controller.Plugin.OPCODE[op]].apply(plugin,
						argList)) {
			// Only one plugin is allowed to handle the event. If for some
			// reason
			// a plugin wants to handle it and still allow other plugins to
			// handle
			// it, it shouldn't return true.
			return true;
		}
	}

	return false;
};

/**
 * Handles keyboard shortcuts on the editor. Note that we bake this into our
 * handleKeyPress/handleKeyDown rather than using goog.events.KeyHandler or
 * goog.ui.KeyboardShortcutHandler for performance reasons. Since these are
 * handled on every key stroke, we do not want to be going out to the event
 * system every time.
 * 
 * @param {goog.events.BrowserEvent}
 *            e The browser event.
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.handleKeyboardShortcut_ = function(e) {
	// Alt key is used for i18n languages to enter certain characters. like
	// control + alt + z (used for IMEs) and control + alt + s for Polish.
	// So we don't invoke handleKeyboardShortcut at all for alt keys.
	if (e.altKey) {
		return;
	}

	var isModifierPressed = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
	if (isModifierPressed
			|| jchemhub.controller.ReactionEditor.POTENTIAL_SHORTCUT_KEYCODES_[e.keyCode]) {
		// TODO: goog.events.KeyHandler uses much more complicated logic
		// to determine key. Consider changing to what they do.
		var key = e.charCode || e.keyCode;

		if (key == 17) { // Ctrl key
			// In IE and Webkit pressing Ctrl key itself results in this event.
			return;
		}

		var stringKey = String.fromCharCode(key).toLowerCase();
		if (this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.SHORTCUT, e,
				stringKey, isModifierPressed)) {
			e.preventDefault();
			// We don't call stopPropagation as some other handler outside of
			// trogedit might need it.
		}
	}
};

/**
 * Handle a change in the Editor. Marks the editor as modified, dispatches the
 * change event on the editable field (moz only), starts the timer for the
 * delayed change event. Note that these actions only occur if the proper events
 * are not stopped.
 */
jchemhub.controller.ReactionEditor.prototype.handleChange = function() {
	// if (this.isEventStopped(jchemhub.controller.ReactionEditor.EventType.CHANGE)) {
	// return;
	// }

	// Clear the changeTimerGecko_ if it's active, since any manual call to
	// handle change is equiavlent to changeTimerGecko_.fire().
	if (this.changeTimerGecko_) {
		this.changeTimerGecko_.stop();
	}

	this.isModified_ = true;
	this.isEverModified_ = true;

	// if (this
	// .isEventStopped(jchemhub.controller.ReactionEditor.EventType.DELAYEDCHANGE)) {
	// return;
	// }

	// this.delayedChangeTimer_.start();
};

/**
 * Handles keydown on the editor.
 * 
 * @param {goog.events.BrowserEvent}
 *            e The browser event.
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.handleKeyDown_ = function(e) {

	this.handleKeyboardShortcut_(e);
};

/**
 * Handles keypress on the field.
 * 
 * @param {goog.events.BrowserEvent}
 *            e The browser event.
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.handleKeyPress_ = function(e) {
	this.gotGeneratingKey_ = true;
	this.dispatchBeforeChange();
	this.handleKeyboardShortcut_(e);
};

/**
 * Handles keyup on the editor.
 * 
 * @param {goog.events.BrowserEvent}
 *            e The browser event.
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.handleKeyUp_ = function(e) {

	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.KEYUP, e);

	if (this
			.isEventStopped(jchemhub.controller.ReactionEditor.EventType.SELECTIONCHANGE)) {
		return;
	}

	this.selectionChangeTimer_.start();

};

jchemhub.controller.ReactionEditor.prototype.handleMouseDown_ = function(e) {

	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.MOUSEDOWN, e);

}

jchemhub.controller.ReactionEditor.prototype.handleMouseUp_ = function(e) {
	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.MOUSEUP, e);
}

jchemhub.controller.ReactionEditor.prototype.handleAtomMouseOver_ = function(e){
	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.ATOM_MOUSEOVER, e);
}

jchemhub.controller.ReactionEditor.prototype.handleAtomMouseOut_ = function(e){
	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.ATOM_MOUSEOUT, e);
}
jchemhub.controller.ReactionEditor.prototype.handleBondMouseOver_ = function(e){
	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.BOND_MOUSEOVER, e);
}

jchemhub.controller.ReactionEditor.prototype.handleBondMouseOut_ = function(e){
	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.BOND_MOUSEOUT, e);
}

jchemhub.controller.ReactionEditor.prototype.handleBondMouseDown_ = function(e){

	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.BOND_MOUSEDOWN, e);
}

/**
 * Gets the value of this command.
 * 
 * @param {string}
 *            command The command to check.
 * @param {boolean}
 *            isEditable Whether the field is currently editable.
 * @return {string|boolean|null} The state of this command. Null if not handled.
 *         False if the field is uneditable and there are no handlers for
 *         uneditable commands.
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.queryCommandValueInternal_ = function(
		command, isEditable) {
	var plugins = this.indexedPlugins_[jchemhub.controller.Plugin.Op.QUERY_COMMAND];
	for ( var i = 0; i < plugins.length; ++i) {
		var plugin = plugins[i];
		if (plugin.isEnabled(this) && plugin.isSupportedCommand(command)
				&& (isEditable || plugin.activeOnUneditableEditors())) {
			return plugin.queryCommandValue(command);
		}
	}
	return isEditable ? null : false;
};

/**
 * Gets the value of command(s).
 * 
 * @param {string|Array.<string>} commands String name(s) of the command.
 * @return {*} Value of each command. Returns false (or array of falses) if
 *         designMode is off or the editor is otherwise uneditable, and there
 *         are no activeOnUneditable plugins for the command.
 */
jchemhub.controller.ReactionEditor.prototype.queryCommandValue = function(commands) {
	var isEditable = this.isLoaded();
	if (goog.isString(commands)) {
		return this.queryCommandValueInternal_(commands, isEditable);
	} else {
		var state = {};
		for ( var i = 0; i < commands.length; i++) {
			state[commands[i]] = this.queryCommandValueInternal_(commands[i],
					isEditable);
		}
		return state;
	}
};

// /**
// * Dispatch a delayed change event.
// *
// * @private
// */
// jchemhub.controller.ReactionEditor.prototype.dispatchDelayedChange_ = function() {
// if (this
// .isEventStopped(jchemhub.controller.ReactionEditor.EventType.DELAYEDCHANGE)) {
// return;
// }
// // Clear the delayedChangeTimer_ if it's active, since any manual call to
// // dispatchDelayedChange_ is equivalent to delayedChangeTimer_.fire().
// this.delayedChangeTimer_.stop();
// this.isModified_ = false;
// this.dispatchEvent(jchemhub.controller.ReactionEditor.EventType.DELAYEDCHANGE);
// };

/**
 * Dispatches the appropriate set of change events. This only fires synchronous
 * change events in blended-mode, iframe-using mozilla. It just starts the
 * appropriate timer for jchemhub.controller.ReactionEditor.DELAYEDCHANGE. This also
 * starts up change events again if they were stopped.
 * 
 * @param {boolean=}
 *            opt_noDelay True if jchemhub.controller.ReactionEditor.DELAYEDCHANGE
 *            should be fired syncronously.
 */
jchemhub.controller.ReactionEditor.prototype.dispatchChange = function(opt_noDelay) {
	this.handleChange();
	// this.startChangeEvents(true, opt_noDelay)
};

/**
 * Dispatch a selection change event, optionally caused by the given browser
 * event.
 * 
 * @param {goog.events.BrowserEvent=}
 *            opt_e Optional browser event causing this event.
 */
jchemhub.controller.ReactionEditor.prototype.dispatchSelectionChangeEvent = function(
		opt_e) {
	// if (this
	// .isEventStopped(jchemhub.controller.ReactionEditor.EventType.SELECTIONCHANGE))
	// {
	// return;
	// }

	this.dispatchCommandValueChange();
	this.dispatchEvent( {
		type : jchemhub.controller.ReactionEditor.EventType.SELECTIONCHANGE,
		originalType : opt_e && opt_e.type
	});

	this.invokeShortCircuitingOp_(jchemhub.controller.Plugin.Op.SELECTION, opt_e);
};

/**
 * Dispatches a command value change event.
 * 
 * @param {Array.<string>=} opt_commands Commands whose state has changed.
 */
jchemhub.controller.ReactionEditor.prototype.dispatchCommandValueChange = function(
		opt_commands) {
	if (opt_commands) {
		this.dispatchEvent( {
			type : jchemhub.controller.ReactionEditor.EventType.COMMAND_VALUE_CHANGE,
			commands : opt_commands
		});
	} else {
		this
				.dispatchEvent(jchemhub.controller.ReactionEditor.EventType.COMMAND_VALUE_CHANGE);
	}
};

/**
 * Executes an editing command as per the registered plugins.
 * 
 * @param {string}
 *            command The command to execute.
 * @param {...*}
 *            var_args Any additional parameters needed to execute the command.
 * @return {Object|boolean} False if the command wasn't handled, otherwise, the
 *         result of the command.
 */
jchemhub.controller.ReactionEditor.prototype.execCommand = function(command, var_args) {
	var args = arguments;
	var result;

	var plugins = this.indexedPlugins_[jchemhub.controller.Plugin.Op.EXEC_COMMAND];
	for ( var i = 0; i < plugins.length; ++i) {
		// If the plugin supports the command, that means it handled the
		// event and we shouldn't propagate to the other plugins.
		var plugin = plugins[i];
		if (plugin.isEnabled(this) && plugin.isSupportedCommand(command)) {
			result = plugin.execCommand.apply(plugin, args);
			break;
		}
	}

	return result;
};

/**
 * Registers the plugin with the editor.
 * 
 * @param {jchemhub.controller.Plugin}
 *            plugin The plugin to register.
 */
jchemhub.controller.ReactionEditor.prototype.registerPlugin = function(plugin) {
	var classId = plugin.getTrogClassId();

	if (this.plugins_[classId]) {
		this.logger
				.severe('Cannot register the same class of plugin twice [' + classId + ']');
	}
	this.plugins_[classId] = plugin;

	// Only key events and execute should have these has* functions with a
	// custom
	// handler array since they need to be very careful about performance.
	// The rest of the plugin hooks should be event-based.
	for ( var op in jchemhub.controller.Plugin.OPCODE) {
		var opcode = jchemhub.controller.Plugin.OPCODE[op];
		if (plugin[opcode]) {
			this.indexedPlugins_[op].push(plugin);
		}
	}
	plugin.registerEditorObject(this);

	// By default we enable all plugins for fields that are currently loaded.
	if (this.isLoaded()) {
		plugin.enable(this);
	}
};

/**
 * Unregisters the plugin with this editor.
 * 
 * @param {jchemhub.controller.Plugin}
 *            plugin The plugin to unregister.
 */
jchemhub.controller.ReactionEditor.prototype.unregisterPlugin = function(plugin) {
	var classId = plugin.getTrogClassId();
	if (!this.plugins_[classId]) {
		this.logger
				.severe('Cannot unregister a plugin that isn\'t registered.');
	}
	delete this.plugins_[classId];

	for ( var op in jchemhub.controller.Plugin.OPCODE) {
		var opcode = jchemhub.controller.Plugin.OPCODE[op];
		if (plugin[opcode]) {
			goog.array.remove(this.indexedPlugins_[op], plugin);
		}
	}

	plugin.unregisterEditorObject(this);
};

/**
 * @return {boolean} Whether the editor has finished loading.
 */
jchemhub.controller.ReactionEditor.prototype.isLoaded = function() {
	return this.loadState_ == jchemhub.controller.ReactionEditor.LoadState_.EDITABLE;
};

/**
 * The load state of the editor.
 * 
 * @enum {number}
 * @private
 */
jchemhub.controller.ReactionEditor.LoadState_ = {
	UNEDITABLE : 0,
	LOADING : 1,
	EDITABLE : 2
};

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.ReactionEditor.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.ReactionEditor');

/**
 * Event types that can be stopped/started.
 * 
 * @enum {string}
 */
jchemhub.controller.ReactionEditor.EventType = {
	/**
	 * Dispatched when the command state of the selection may have changed. This
	 * event should be listened to for updating toolbar state.
	 */
	COMMAND_VALUE_CHANGE : 'cvc',
	/**
	 * Dispatched when the editor is loaded and ready to use.
	 */
	LOAD : 'load',
	/**
	 * Dispatched when the editor is fully unloaded and uneditable.
	 */
	UNLOAD : 'unload',
	/**
	 * Dispatched before the editor contents are changed.
	 */
	BEFORECHANGE : 'beforechange',
	/**
	 * Dispatched when the editor contents change, in FF only. Used for internal
	 * resizing, please do not use.
	 */
	CHANGE : 'change',
	/**
	 * Dispatched on a slight delay after changes are made. Use for autosave, or
	 * other times your app needs to know that the editor contents changed.
	 */
	DELAYEDCHANGE : 'delayedchange',
	/**
	 * Dispatched before focus in moved into the editor.
	 */
	BEFOREFOCUS : 'beforefocus',
	/**
	 * Dispatched when focus is moved into the editor.
	 */
	FOCUS : 'focus',
	/**
	 * Dispatched when the editor is blurred.
	 */
	BLUR : 'blur',
	/**
	 * Dispach before tab is handled by the editor. This is a legacy way of
	 * controlling tab behavior. Use trog.plugins.AbstractTabHandler now.
	 */
	BEFORETAB : 'beforetab',
	/**
	 * Dispatched when the selection changes. Use handleSelectionChange from
	 * plugin API instead of listening directly to this event.
	 */
	SELECTIONCHANGE : 'selectionchange'
};

/**
 * Removes all listeners and destroys the eventhandler object.
 * 
 * @override
 */
jchemhub.controller.ReactionEditor.prototype.disposeInternal = function() {
	if (this.isLoading() || this.isLoaded()) {
		this.logger.warning('Disposing an editor that is in use.');
	}

	if (this.getOriginalElement()) {
		this.execCommand(jchemhub.controller.Command.CLEAR);
	}

	this.tearDownEditorObject_();
	this.clearListeners_();
	this.originalDomHelper = null;

	if (this.eventRegister) {
		this.eventRegister.dispose();
		this.eventRegister = null;
	}

	this.removeAllWrappers();

	if (jchemhub.controller.ReactionEditor.getActiveEditorId() == this.id) {
		jchemhub.controller.ReactionEditor.setActiveEditorId(null);
	}

	for ( var classId in this.plugins_) {
		var plugin = this.plugins_[classId];
		if (plugin.isAutoDispose()) {
			plugin.dispose();
		}
	}
	delete (this.plugins_);

	jchemhub.controller.ReactionEditor.superClass_.disposeInternal.call(this);
};

/**
 * Returns the registered plugin with the given classId.
 * 
 * @param {string}
 *            classId classId of the plugin.
 * @return {jchemhub.controller.Plugin} Registered plugin with the given classId.
 */
jchemhub.controller.ReactionEditor.prototype.getPluginByClassId = function(classId) {
	return this.plugins_[classId];
};

/**
 * Help make the editor not editable by setting internal data structures to
 * null, and disabling this editor with all registered plugins.
 * 
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.tearDownEditorObject_ = function() {
	for ( var classId in this.plugins_) {
		var plugin = this.plugins_[classId];
		if (!plugin.activeOnUneditableEditors()) {
			plugin.disable(this);
		}
	}

	this.loadState_ = jchemhub.controller.ReactionEditor.LoadState_.UNEDITABLE;

};

/**
 * @return {boolean} Whether the editor has finished loading.
 */
jchemhub.controller.ReactionEditor.prototype.isLoaded = function() {
	return this.loadState_ == jchemhub.controller.ReactionEditor.LoadState_.EDITABLE;
};

/**
 * @return {boolean} Whether the editor is in the process of loading.
 */
jchemhub.controller.ReactionEditor.prototype.isLoading = function() {
	return this.loadState_ == jchemhub.controller.ReactionEditor.LoadState_.LOADING;
};

/**
 * Returns original DOM element for the Editor null if that element has not yet
 * been found in the appropriate document.
 * 
 * @return {Element} The original element.
 */
jchemhub.controller.ReactionEditor.prototype.getOriginalElement = function() {
	return this.originalElement;
};

// /**
// * Stops the event of the given type from being dispatched.
// *
// * @param {jchemhub.controller.ReactionEditor.EventType}
// * eventType type of event to stop.
// */
// jchemhub.controller.ReactionEditor.prototype.stopEvent = function(eventType) {
// this.stoppedEvents_[eventType] = 1;
// };

// /**
// * Re-starts the event of the given type being dispatched, if it had
// previously
// * been stopped with stopEvent().
// *
// * @param {jchemhub.controller.ReactionEditor.EventType}
// * eventType type of event to start.
// */
// jchemhub.controller.ReactionEditor.prototype.startEvent = function(eventType) {
// // Toggling this bit on/off instead of deleting it/re-adding it
// // saves array allocations.
// this.stoppedEvents_[eventType] = 0;
// };

/**
 * Stops all listeners and timers.
 * 
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.clearListeners_ = function() {
	if (this.eventRegister) {
		this.eventRegister.removeAll();
	}

	// if (this.changeTimerGecko_) {
	// this.changeTimerGecko_.stop();
	// }
	// this.delayedChangeTimer_.stop();
};

/**
 * Removes all wrappers and destroys them.
 */
jchemhub.controller.ReactionEditor.prototype.removeAllWrappers = function() {
	var wrapper;
	while (wrapper = this.wrappers_.pop()) {
		wrapper.dispose();
	}
};

/**
 * Handle the loading of the editor (e.g. once the editor is ready to setup).
 * 
 * @protected
 */
jchemhub.controller.ReactionEditor.prototype.handleEditorLoad = function() {

	if (jchemhub.controller.ReactionEditor.getActiveEditorId() != this.id) {
		// this.execCommand(jchemhub.controller.Command.CLEAR_EDITOR);
	}

	this.setupChangeListeners_();
	this.dispatchLoadEvent_();

	// Enabling plugins after we fire the load event so that clients have a
	// chance to set initial field contents before we start mucking with
	// everything.
	for ( var classId in this.plugins_) {
		this.plugins_[classId].enable(this);
	}
};

// /**
// * Don't wait for the timer and just fire the delayed change event if it's
// * pending.
// */
// jchemhub.controller.ReactionEditor.prototype.clearDelayedChange = function() {
// // The changeTimerGecko_ will queue up a delayed change so to fully clear
// // delayed change we must also clear this timer.
// if (this.changeTimerGecko_) {
// this.changeTimerGecko_.fireIfActive();
// }
// this.delayedChangeTimer_.fireIfActive();
// };

/**
 * Signal that the editor is loaded and ready to use. Change events now are in
 * effect.
 * 
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.dispatchLoadEvent_ = function() {
	this.installStyles();
	// this.startChangeEvents();
	this.logger.info('Dispatching load ' + this.id);
	this.dispatchEvent(jchemhub.controller.ReactionEditor.EventType.LOAD);
};

/**
 * Registers a keyboard event listener on the editor. This is necessary for
 * Gecko since the fields are contained in an iFrame and there is no way to
 * auto-propagate key events up to the main window.
 * 
 * @param {string|Array.<string>} type Event type to listen for or array of event types,
 *            for example goog.events.EventType.KEYDOWN.
 * @param {Function}
 *            listener Function to be used as the listener.
 * @param {boolean=}
 *            opt_capture Whether to use capture phase (optional, defaults to
 *            false).
 * @param {Object=}
 *            opt_handler Object in whose scope to call the listener.
 */
jchemhub.controller.ReactionEditor.prototype.addListener = function(type, listener,
		opt_capture, opt_handler) {
	var elem = this.getOriginalElement();

	// On Gecko, keyboard events only reliably fire on the document element.
	if (elem && goog.editor.BrowserFeature.USE_DOCUMENT_FOR_KEY_EVENTS) {
		elem = elem.ownerDocument;
	}
	this.eventRegister.listen(elem, type, listener, opt_capture, opt_handler);
};

/**
 * Initialize listeners on the editor.
 * 
 * @private
 */
jchemhub.controller.ReactionEditor.prototype.setupChangeListeners_ = function() {

	this.addListener(goog.events.EventType.BLUR, this.dispatchBlur,
			goog.editor.BrowserFeature.USE_MUTATION_EVENTS);

	if (goog.editor.BrowserFeature.USE_MUTATION_EVENTS) {
		// Ways to detect changes in Mozilla:
		//
		// keypress - check event.charCode (only typable characters has a
		// charCode), but also keyboard commands lile Ctrl+C will
		// return a charCode.
		// dragdrop - fires when the user drops something. This does not
		// necessary
		// lead to a change but we cannot detect if it will or not
		//
		// Known Issues: We cannot detect cut and paste using menus
		// We cannot detect when someone moves something out of the
		// field using drag and drop.
		//
		this.setupMutationEventHandlersGecko();
	} else {
		// Ways to detect that a change is about to happen in other browsers.
		// (IE and Safari have these events. Opera appears to work, but we
		// haven't
		// researched it.)
		//
		// onbeforepaste
		// onbeforecut
		// ondrop - happens when the user drops something on the editable text
		// field the value at this time does not contain the dropped text
		// ondragleave - when the user drags something from the current
		// document.
		// This might not cause a change if the action was copy
		// instead of move
		// onkeypress - IE only fires keypress events if the key will generate
		// output. It will not trigger for delete and backspace
		// onkeydown - For delete and backspace
		//
		// known issues: IE triggers beforepaste just by opening the edit menu
		// delete at the end should not cause beforechange
		// backspace at the beginning should not cause beforechange
		// see above in ondragleave
		// TODO: Why don't we dispatchBeforeChange from the
		// handleDrop event for all browsers?
		this.addListener( [ 'beforecut', 'beforepaste', 'drop', 'dragend' ],
				this.dispatchBeforeChange);
		this.addListener( [ 'cut', 'paste' ], this.dispatchChange);
		this.addListener('drop', this.handleDrop_);
	}

	// TODO: Figure out why we use dragend vs dragdrop and
	// document this better.
	var dropEventName = goog.userAgent.WEBKIT ? 'dragend' : 'dragdrop';
	this.addListener(dropEventName, this.handleDrop_);

	this.addListener(goog.events.EventType.KEYDOWN, this.handleKeyDown_);
	this.addListener(goog.events.EventType.KEYPRESS, this.handleKeyPress_);
	this.addListener(goog.events.EventType.KEYUP, this.handleKeyUp_);

	var selectionChange = goog.bind(this.dispatchSelectionChangeEvent, this);
	this.selectionChangeTimer_ = new goog.async.Delay(selectionChange,
			jchemhub.controller.ReactionEditor.SELECTION_CHANGE_FREQUENCY_);

	this.addListener(goog.events.EventType.MOUSEDOWN, this.handleMouseDown_);
	this.addListener(goog.events.EventType.MOUSEUP, this.handleMouseUp_);

	this.addEventListener(jchemhub.controller.AtomController.EventType.MOUSEOUT, this.handleAtomMouseOut_);
	this.addEventListener(jchemhub.controller.AtomController.EventType.MOUSEOVER, this.handleAtomMouseOver_);
	this.addEventListener(jchemhub.controller.BondController.EventType.MOUSEOUT, this.handleBondMouseOut_);
	this.addEventListener(jchemhub.controller.BondController.EventType.MOUSEOVER, this.handleBondMouseOver_);
	this.addEventListener(jchemhub.controller.BondController.EventType.MOUSEDOWN, this.handleBondMouseDown_);

};

/**
 * Mutation events tell us when something has changed for mozilla.
 * 
 * @protected
 */
jchemhub.controller.ReactionEditor.prototype.setupMutationEventHandlersGecko = function() {
	if (goog.editor.BrowserFeature.HAS_DOM_SUBTREE_MODIFIED_EVENT) {
		this.eventRegister.listen(this.getElement(), 'DOMSubtreeModified',
				this.handleMutationEventGecko_);
	} else {
		var doc = this.getEditableDomHelper().getDocument();
		this.eventRegister.listen(doc,
				jchemhub.controller.ReactionEditor.MUTATION_EVENTS_GECKO,
				this.handleMutationEventGecko_, true);

		// DOMAttrModified fires for a lot of events we want to ignore. This
		// goes
		// through a different handler so that we can ignore many of these.
		this.eventRegister.listen(doc, 'DOMAttrModified',
				goog.bind(this.handleDomAttrChange, this,
						this.handleMutationEventGecko_), true);
	}
};

/**
 * Installs styles if needed. Only writes styles when they can't be written
 * inline directly into the field.
 * 
 * @protected
 */
jchemhub.controller.ReactionEditor.prototype.installStyles = function() {
	if (this.cssStyles && this.shouldLoadAsynchronously()) {
		goog.style.installStyles(this.cssStyles, this.getElement());
	}
};
//
// /**
// * Start change events again and fire once if desired.
// *
// * @param {boolean=}
// * opt_fireChange Whether to fire the change event immediately.
// * @param {boolean=}
// * opt_fireDelayedChange Whether to fire the delayed change event
// * immediately.
// */
// jchemhub.controller.ReactionEditor.prototype.startChangeEvents = function(
// opt_fireChange, opt_fireDelayedChange) {
//
// if (!opt_fireChange && this.changeTimerGecko_) {
// // In the case where change events were stopped and we're not firing
// // them on start, the user was trying to suppress all change or delayed
// // change events. Clear the change timer now while the events are still
// // stopped so that its firing doesn't fire a stopped change event, or
// // queue up a delayed change event that we were trying to stop.
// this.changeTimerGecko_.fireIfActive();
// }
//
// this.startEvent(jchemhub.controller.ReactionEditor.EventType.CHANGE);
// this.startEvent(jchemhub.controller.ReactionEditor.EventType.DELAYEDCHANGE);
// if (opt_fireChange) {
// this.handleChange();
// }
//
// if (opt_fireDelayedChange) {
// this.dispatchDelayedChange_();
// }
// };

/**
 * Frequency to check for selection changes.
 * 
 * @type {number}
 * @private
 */
jchemhub.controller.ReactionEditor.SELECTION_CHANGE_FREQUENCY_ = 250;

/**
 * A default configuration for the reaction editor.
 */
jchemhub.controller.ReactionEditor.defaultConfig = {
	background : {
		color : '#F0FFF0'
	},
	margin : 20
};
