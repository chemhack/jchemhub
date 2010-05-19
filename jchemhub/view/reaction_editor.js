goog.provide("jchemhub.view.ReactionEditor");
goog.provide("jchemhub.view.ReactionEditor.EventType");
goog.require("jchemhub.view.Drawing");
goog.require("goog.graphics");
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.async.Delay');
goog.require('jchemhub.view.Plugin');

/**
 * A graphical editor for reactions
 * 
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.ReactionEditor = function(element, opt_config) {
	jchemhub.view.Drawing.call(this);
	this.originalElement = element;
	/**
	 * Map of class id to registered plugin.
	 * 
	 * @type {Object}
	 * @private
	 */
	this.plugins_ = {};

	/**
	 * Plugins registered on this field, indexed by the jchemhub.view.Plugin.Op
	 * that they support.
	 * 
	 * @type {Object.<Array>}
	 * @private
	 */
	this.indexedPlugins_ = {};

	for ( var op in jchemhub.view.Plugin.OPCODE) {
		this.indexedPlugins_[op] = [];
	}
	this._config = new goog.structs.Map(
			jchemhub.view.ReactionEditor.defaultConfig);
	if (opt_config) {
		this._config.addAll(opt_config); // merge optional config into
		// defaults
	}
	
	this.zoom_factor=1;

	this._graphics = goog.graphics.createGraphics(element.offsetWidth,
			element.offsetTop);

	this._graphics.render(this.originalElement);

	// The editor will not listen to change events until it has finished loading
	this.stoppedEvents_ = {};
	this.stopEvent(jchemhub.view.ReactionEditor.EventType.CHANGE);
	this.stopEvent(jchemhub.view.ReactionEditor.EventType.DELAYEDCHANGE);
	this.isModified_ = false;
	this.isEverModified_ = false;

	this.delayedChangeTimer_ = new goog.async.Delay(
			this.dispatchDelayedChange_,
			jchemhub.view.ReactionEditor.DELAYED_CHANGE_FREQUENCY, this);

	/**
	 * @type {goog.events.EventHandler}
	 * @protected
	 */
	this.eventRegister = new goog.events.EventHandler(this);

	// Wrappers around this editor, to be disposed when the editor is disposed.
	this.wrappers_ = [];

	this.handleEditorLoad();

	this.loadState_ = jchemhub.view.ReactionEditor.LoadState_.EDITABLE;

	this.editableDomHelper = goog.dom.getDomHelper(element);
	this.isModified_ = false;
	this.isEverModified_ = false;

};
goog.inherits(jchemhub.view.ReactionEditor, jchemhub.view.Drawing);

/**
 * Sets the active editor id.
 * 
 * @param {?string}
 *            editorId The active editor id.
 */
jchemhub.view.ReactionEditor.setActiveEditorId = function(editorId) {
	jchemhub.view.ReactionEditor.activeEditorId_ = editorId;
};

/**
 * @return {?string} The id of the active editor.
 */
jchemhub.view.ReactionEditor.getActiveEditorId = function() {
	return jchemhub.view.ReactionEditor.activeEditorId_;
};

jchemhub.view.ReactionEditor.prototype.clear = function() {
	jchemhub.view.ReactionEditor.superClass_.clear.call(this);
	this._graphics.clear();
	var fill = new goog.graphics.SolidFill(
			this.getConfig().get("background").color);

	this._graphics.drawRect(0, 0, this._graphics.getSize().width,
			this._graphics.getSize().height, null, fill);
}

jchemhub.view.ReactionEditor.prototype.setModel = function(model) {
	this.clear();
	this.model = model;
	if (model instanceof jchemhub.model.Reaction) {
		this.add(new jchemhub.view.ReactionDrawing(model));
	}
	if (model instanceof jchemhub.model.Molecule) {
		this.add(new jchemhub.view.MoleculeDrawing(model));
	}
}

/**
 * layout and render
 */

jchemhub.view.ReactionEditor.prototype.layoutAndRender = function() {

	var margin = this.getConfig().get("margin");
	this.layout(new goog.math.Rect(margin, margin, this.zoom_factor * this.getSize().width
			- margin * 2, this.zoom_factor * this.getSize().height - margin * 2));
	this.render();
}

/**
 * set up transform to layout drawing and all children to fit rectangle
 * 
 * @param rect
 *            {goog.math.Rect}
 */
jchemhub.view.ReactionEditor.prototype.layout = function(to_rect) {

	var from_rect = this.getRect();
	// preserve aspect ratio
	var to_size = from_rect.getSize().scaleToFit(to_rect.getSize());
	var scale = to_size.width / from_rect.width
	var dx = to_rect.left - (from_rect.left * scale);
	var dy = to_rect.top - (from_rect.top * scale);
	this.setTransform(new goog.graphics.AffineTransform(scale, 0, 0, scale, dx,
			dy));

};

/*
 * @override 
 * @return {goog.math.Rect}
 */
jchemhub.view.ReactionEditor.prototype.getRect = function() {
	return new goog.math.Rect(0, 0, this._graphics.getSize().width,
			this._graphics.getSize().height);
};

/**
 * get transform
 * 
 * @return{goog.graphics.AffineTransform}
 */
jchemhub.view.ReactionEditor.prototype.getTransform = function() {
	return this._transform;
}


/**
 * render this drawing and all its children
 */
jchemhub.view.ReactionEditor.prototype.render = function() {
	this.renderChildren();
}

/**
 * gets model from contained reaction drawing
 * 
 * @return{jchemhub.model.Reaction | jchemhub.model.Molecule}
 */
jchemhub.view.ReactionEditor.prototype.getModel = function() {
	var children = this.getChildren();

	return this.getChildren()[0]
};

/**
 * This dispatches the beforechange event on the editable reaction editor
 */
jchemhub.view.ReactionEditor.prototype.dispatchBeforeChange = function() {
	if (this
			.isEventStopped(jchemhub.view.ReactionEditor.EventType.BEFORECHANGE)) {
		return;
	}

	this.dispatchEvent(jchemhub.view.ReactionEditor.EventType.BEFORECHANGE);
};

/**
 * Checks if the event of the given type has stopped being dispatched
 * 
 * @param {goog.editor.Field.EventType}
 *            eventType type of event to check.
 * @return {boolean} true if the event has been stopped with stopEvent().
 * @protected
 */
jchemhub.view.ReactionEditor.prototype.isEventStopped = function(eventType) {
	return !!this.stoppedEvents_[eventType];
};

/**
 * Returns true if the keypress generates a change in the contents. due to a
 * special key listed in jchemhub.view.ReactionEditor.KEYS_CAUSING_CHANGES_
 * 
 * @param {goog.events.BrowserEvent}
 *            e The event.
 * @return {boolean} Whether the keypress generated a change in the contents.
 * @private
 */
jchemhub.view.ReactionEditor.isSpecialGeneratingKey_ = function(e) {
	var testCtrlKeys = (e.ctrlKey || e.metaKey)
			&& e.keyCode in jchemhub.view.ReactionEditor.CTRL_KEYS_CAUSING_CHANGES_;
	var testRegularKeys = !(e.ctrlKey || e.metaKey)
			&& e.keyCode in jchemhub.view.ReactionEditor.KEYS_CAUSING_CHANGES_;

	return testCtrlKeys || testRegularKeys;
};

/**
 * Map of keyCodes (not charCodes) that when used in conjunction with the Ctrl
 * key cause changes in the field contents. These are the keys that are not
 * handled by basic formatting plugins.
 * 
 * @type {Object}
 * @private
 */
jchemhub.view.ReactionEditor.CTRL_KEYS_CAUSING_CHANGES_ = {
	86 : true, // V
	88 : true
// X
};

/**
 * Map of keyCodes (not charCodes) that cause changes in the field contents.
 * 
 * @type {Object}
 * @private
 */
jchemhub.view.ReactionEditor.KEYS_CAUSING_CHANGES_ = {
	46 : true, // DEL
	8 : true
// BACKSPACE
};

if (!goog.userAgent.IE) {
	// Only IE doesn't change the field by default upon tab.
	// TODO: This really isn't right now that we have tab plugins.
	jchemhub.view.ReactionEditor.KEYS_CAUSING_CHANGES_[9] = true; // TAB
}

if (goog.userAgent.IE) {
	// In IE input from IME (Input Method Editor) does not generate keypress
	// event so we have to rely on the keydown event. This way we have
	// false positives while the user is using keyboard to select the
	// character to input, but it is still better than the false negatives
	// that ignores user's final input at all.
	jchemhub.view.ReactionEditor.KEYS_CAUSING_CHANGES_[229] = true; // from IME;
}

/**
 * Calls all the plugins of the given operation, in sequence, with the given
 * arguments. This is short-circuiting: once one plugin cancels the event, no
 * more plugins will be invoked.
 * 
 * @param {jchemhub.view.Plugin.Op}
 *            op A plugin op.
 * @param {...*}
 *            var_args The arguments to the plugin.
 * @return {boolean} True if one of the plugins cancel the event, false
 *         otherwise.
 * @private
 */
jchemhub.view.ReactionEditor.prototype.invokeShortCircuitingOp_ = function(op,
		var_args) {
	var plugins = this.indexedPlugins_[op];
	var argList = goog.array.slice(arguments, 1);
	for ( var i = 0; i < plugins.length; ++i) {
		// If the plugin returns true, that means it handled the event and
		// we shouldn't propagate to the other plugins.
		var plugin = plugins[i];
		if ((plugin.isEnabled(this) || jchemhub.view.Plugin.IRREPRESSIBLE_OPS[op])
				&& plugin[jchemhub.view.Plugin.OPCODE[op]].apply(plugin,
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
jchemhub.view.ReactionEditor.prototype.handleKeyboardShortcut_ = function(e) {
	// Alt key is used for i18n languages to enter certain characters. like
	// control + alt + z (used for IMEs) and control + alt + s for Polish.
	// So we don't invoke handleKeyboardShortcut at all for alt keys.
	if (e.altKey) {
		return;
	}

	var isModifierPressed = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
	if (isModifierPressed
			|| jchemhub.view.ReactionEditor.POTENTIAL_SHORTCUT_KEYCODES_[e.keyCode]) {
		// TODO: goog.events.KeyHandler uses much more complicated logic
		// to determine key. Consider changing to what they do.
		var key = e.charCode || e.keyCode;

		if (key == 17) { // Ctrl key
			// In IE and Webkit pressing Ctrl key itself results in this event.
			return;
		}

		var stringKey = String.fromCharCode(key).toLowerCase();
		if (this.invokeShortCircuitingOp_(jchemhub.view.Plugin.Op.SHORTCUT, e,
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
jchemhub.view.ReactionEditor.prototype.handleChange = function() {
	if (this.isEventStopped(jchemhub.view.ReactionEditor.EventType.CHANGE)) {
		return;
	}

	// Clear the changeTimerGecko_ if it's active, since any manual call to
	// handle change is equiavlent to changeTimerGecko_.fire().
	if (this.changeTimerGecko_) {
		this.changeTimerGecko_.stop();
	}

	this.isModified_ = true;
	this.isEverModified_ = true;

	if (this
			.isEventStopped(jchemhub.view.ReactionEditor.EventType.DELAYEDCHANGE)) {
		return;
	}

	this.delayedChangeTimer_.start();
};

/**
 * Handles keydown on the editor.
 * 
 * @param {goog.events.BrowserEvent}
 *            e The browser event.
 * @private
 */
jchemhub.view.ReactionEditor.prototype.handleKeyDown_ = function(e) {
	this.handleKeyboardShortcut_(e);
};

/**
 * Handles keypress on the field.
 * 
 * @param {goog.events.BrowserEvent}
 *            e The browser event.
 * @private
 */
jchemhub.view.ReactionEditor.prototype.handleKeyPress_ = function(e) {
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
jchemhub.view.ReactionEditor.prototype.handleKeyUp_ = function(e) {

	this.invokeShortCircuitingOp_(jchemhub.view.Plugin.Op.KEYUP, e);

	if (this
			.isEventStopped(jchemhub.view.ReactionEditor.EventType.SELECTIONCHANGE)) {
		return;
	}

	this.selectionChangeTimer_.start();

};

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
jchemhub.view.ReactionEditor.prototype.queryCommandValueInternal_ = function(
		command, isEditable) {
	var plugins = this.indexedPlugins_[jchemhub.view.Plugin.Op.QUERY_COMMAND];
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
 * @param {string|Array.
 *            <string>} commands String name(s) of the command.
 * @return {*} Value of each command. Returns false (or array of falses) if
 *         designMode is off or the editor is otherwise uneditable, and there
 *         are no activeOnUneditable plugins for the command.
 */
jchemhub.view.ReactionEditor.prototype.queryCommandValue = function(commands) {
	var isEditable = this.isLoaded() && this.isSelectionEditable();
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

/**
 * Dispatch a delayed change event.
 * 
 * @private
 */
jchemhub.view.ReactionEditor.prototype.dispatchDelayedChange_ = function() {
	if (this
			.isEventStopped(jchemhub.view.ReactionEditor.EventType.DELAYEDCHANGE)) {
		return;
	}
	// Clear the delayedChangeTimer_ if it's active, since any manual call to
	// dispatchDelayedChange_ is equivalent to delayedChangeTimer_.fire().
	this.delayedChangeTimer_.stop();
	this.isModified_ = false;
	this.dispatchEvent(jchemhub.view.ReactionEditor.EventType.DELAYEDCHANGE);
};

/**
 * Dispatches the appropriate set of change events. This only fires synchronous
 * change events in blended-mode, iframe-using mozilla. It just starts the
 * appropriate timer for jchemhub.view.ReactionEditor.DELAYEDCHANGE. This also
 * starts up change events again if they were stopped.
 * 
 * @param {boolean=}
 *            opt_noDelay True if jchemhub.view.ReactionEditor.DELAYEDCHANGE
 *            should be fired syncronously.
 */
jchemhub.view.ReactionEditor.prototype.dispatchChange = function(opt_noDelay) {
	this.startChangeEvents(true, opt_noDelay)
};

/**
 * Dispatch a selection change event, optionally caused by the given browser
 * event.
 * 
 * @param {goog.events.BrowserEvent=}
 *            opt_e Optional browser event causing this event.
 */
jchemhub.view.ReactionEditor.prototype.dispatchSelectionChangeEvent = function(
		opt_e) {
	if (this
			.isEventStopped(jchemhub.view.ReactionEditor.EventType.SELECTIONCHANGE)) {
		return;
	}

	this.dispatchCommandValueChange();
	this.dispatchEvent( {
		type : jchemhub.view.ReactionEditor.EventType.SELECTIONCHANGE,
		originalType : opt_e && opt_e.type
	});

	this.invokeShortCircuitingOp_(jchemhub.view.Plugin.Op.SELECTION, opt_e);
};

/**
 * Dispatches a command value change event.
 * 
 * @param {Array.
 *            <string>=} opt_commands Commands whose state has changed.
 */
jchemhub.view.ReactionEditor.prototype.dispatchCommandValueChange = function(
		opt_commands) {
	if (opt_commands) {
		this.dispatchEvent( {
			type : jchemhub.view.ReactionEditor.EventType.COMMAND_VALUE_CHANGE,
			commands : opt_commands
		});
	} else {
		this
				.dispatchEvent(jchemhub.view.ReactionEditor.EventType.COMMAND_VALUE_CHANGE);
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
jchemhub.view.ReactionEditor.prototype.execCommand = function(command, var_args) {
	var args = arguments;
	var result;

	var plugins = this.indexedPlugins_[jchemhub.view.Plugin.Op.EXEC_COMMAND];
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
 * @param {jchemhub.view.Plugin}
 *            plugin The plugin to register.
 */
jchemhub.view.ReactionEditor.prototype.registerPlugin = function(plugin) {
	var classId = plugin.getTrogClassId();
	if (this.plugins_[classId]) {
		this.logger.severe('Cannot register the same class of plugin twice.');
	}
	this.plugins_[classId] = plugin;

	// Only key events and execute should have these has* functions with a
	// custom
	// handler array since they need to be very careful about performance.
	// The rest of the plugin hooks should be event-based.
	for ( var op in jchemhub.view.Plugin.OPCODE) {
		var opcode = jchemhub.view.Plugin.OPCODE[op];
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
 * @param {jchemhub.view.Plugin}
 *            plugin The plugin to unregister.
 */
jchemhub.view.ReactionEditor.prototype.unregisterPlugin = function(plugin) {
	var classId = plugin.getTrogClassId();
	if (!this.plugins_[classId]) {
		this.logger
				.severe('Cannot unregister a plugin that isn\'t registered.');
	}
	delete this.plugins_[classId];

	for ( var op in jchemhub.view.Plugin.OPCODE) {
		var opcode = jchemhub.view.Plugin.OPCODE[op];
		if (plugin[opcode]) {
			goog.array.remove(this.indexedPlugins_[op], plugin);
		}
	}

	plugin.unregisterEditorObject(this);
};

/**
 * @return {boolean} Whether the editor has finished loading.
 */
jchemhub.view.ReactionEditor.prototype.isLoaded = function() {
	return this.loadState_ == jchemhub.view.ReactionEditor.LoadState_.EDITABLE;
};

/**
 * The load state of the editor.
 * 
 * @enum {number}
 * @private
 */
jchemhub.view.ReactionEditor.LoadState_ = {
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
jchemhub.view.ReactionEditor.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.ReactionEditor');

/**
 * Event types that can be stopped/started.
 * 
 * @enum {string}
 */
jchemhub.view.ReactionEditor.EventType = {
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
jchemhub.view.ReactionEditor.prototype.disposeInternal = function() {
	if (this.isLoading() || this.isLoaded()) {
		this.logger.warning('Disposing an editor that is in use.');
	}

	if (this.getOriginalElement()) {
		this.execCommand(jchemhub.view.Command.CLEAR);
	}

	this.tearDownEditorObject_();
	this.clearListeners_();
	this.originalDomHelper = null;

	if (this.eventRegister) {
		this.eventRegister.dispose();
		this.eventRegister = null;
	}

	this.removeAllWrappers();

	if (jchemhub.view.ReactionEditor.getActiveEditorId() == this.id) {
		jchemhub.view.ReactionEditor.setActiveEditorId(null);
	}

	for ( var classId in this.plugins_) {
		var plugin = this.plugins_[classId];
		if (plugin.isAutoDispose()) {
			plugin.dispose();
		}
	}
	delete (this.plugins_);

	jchemhub.view.ReactionEditor.superClass_.disposeInternal.call(this);
};

/**
 * Returns the registered plugin with the given classId.
 * 
 * @param {string}
 *            classId classId of the plugin.
 * @return {jchemhub.view.Plugin} Registered plugin with the given classId.
 */
jchemhub.view.ReactionEditor.prototype.getPluginByClassId = function(classId) {
	return this.plugins_[classId];
};

/**
 * Help make the editor not editable by setting internal data structures to
 * null, and disabling this editor with all registered plugins.
 * 
 * @private
 */
jchemhub.view.ReactionEditor.prototype.tearDownEditorObject_ = function() {
	for ( var classId in this.plugins_) {
		var plugin = this.plugins_[classId];
		if (!plugin.activeOnUneditableEditors()) {
			plugin.disable(this);
		}
	}

	this.loadState_ = jchemhub.view.ReactionEditor.LoadState_.UNEDITABLE;

};

/**
 * @return {boolean} Whether the editor has finished loading.
 */
jchemhub.view.ReactionEditor.prototype.isLoaded = function() {
	return this.loadState_ == jchemhub.view.ReactionEditor.LoadState_.EDITABLE;
};

/**
 * @return {boolean} Whether the editor is in the process of loading.
 */
jchemhub.view.ReactionEditor.prototype.isLoading = function() {
	return this.loadState_ == jchemhub.view.ReactionEditor.LoadState_.LOADING;
};

/**
 * Returns original DOM element for the Editor null if that element has not yet
 * been found in the appropriate document.
 * 
 * @return {Element} The original element.
 */
jchemhub.view.ReactionEditor.prototype.getOriginalElement = function() {
	return this.originalElement;
};

/**
 * Stops the event of the given type from being dispatched.
 * 
 * @param {jchemhub.view.ReactionEditor.EventType}
 *            eventType type of event to stop.
 */
jchemhub.view.ReactionEditor.prototype.stopEvent = function(eventType) {
	this.stoppedEvents_[eventType] = 1;
};

/**
 * Re-starts the event of the given type being dispatched, if it had previously
 * been stopped with stopEvent().
 * 
 * @param {jchemhub.view.ReactionEditor.EventType}
 *            eventType type of event to start.
 */
jchemhub.view.ReactionEditor.prototype.startEvent = function(eventType) {
	// Toggling this bit on/off instead of deleting it/re-adding it
	// saves array allocations.
	this.stoppedEvents_[eventType] = 0;
};

/**
 * Stops all listeners and timers.
 * 
 * @private
 */
jchemhub.view.ReactionEditor.prototype.clearListeners_ = function() {
	if (this.eventRegister) {
		this.eventRegister.removeAll();
	}

	if (this.changeTimerGecko_) {
		this.changeTimerGecko_.stop();
	}
	this.delayedChangeTimer_.stop();
};

/**
 * Removes all wrappers and destroys them.
 */
jchemhub.view.ReactionEditor.prototype.removeAllWrappers = function() {
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
jchemhub.view.ReactionEditor.prototype.handleEditorLoad = function() {

	if (jchemhub.view.ReactionEditor.getActiveEditorId() != this.id) {
		// this.execCommand(jchemhub.view.Command.CLEAR_EDITOR);
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

/**
 * Don't wait for the timer and just fire the delayed change event if it's
 * pending.
 */
jchemhub.view.ReactionEditor.prototype.clearDelayedChange = function() {
	// The changeTimerGecko_ will queue up a delayed change so to fully clear
	// delayed change we must also clear this timer.
	if (this.changeTimerGecko_) {
		this.changeTimerGecko_.fireIfActive();
	}
	this.delayedChangeTimer_.fireIfActive();
};

/**
 * Signal that the editor is loaded and ready to use. Change events now are in
 * effect.
 * 
 * @private
 */
jchemhub.view.ReactionEditor.prototype.dispatchLoadEvent_ = function() {
	this.installStyles();
	this.startChangeEvents();
	this.logger.info('Dispatching load ' + this.id);
	this.dispatchEvent(jchemhub.view.ReactionEditor.EventType.LOAD);
};

/**
 * Registers a keyboard event listener on the editor. This is necessary for
 * Gecko since the fields are contained in an iFrame and there is no way to
 * auto-propagate key events up to the main window.
 * 
 * @param {string|Array.
 *            <string>} type Event type to listen for or array of event types,
 *            for example goog.events.EventType.KEYDOWN.
 * @param {Function}
 *            listener Function to be used as the listener.
 * @param {boolean=}
 *            opt_capture Whether to use capture phase (optional, defaults to
 *            false).
 * @param {Object=}
 *            opt_handler Object in whose scope to call the listener.
 */
jchemhub.view.ReactionEditor.prototype.addListener = function(type, listener,
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
jchemhub.view.ReactionEditor.prototype.setupChangeListeners_ = function() {

	if (goog.editor.BrowserFeature.SUPPORTS_FOCUSIN) {
		this.addListener(goog.events.EventType.FOCUS, this.dispatchFocus_);
		this.addListener(goog.events.EventType.FOCUSIN,
				this.dispatchBeforeFocus_);
	} else {
		this.addListener(goog.events.EventType.FOCUS,
				this.dispatchFocusAndBeforeFocus_);
	}
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
			jchemhub.view.ReactionEditor.SELECTION_CHANGE_FREQUENCY_);

	this.addListener(goog.events.EventType.MOUSEDOWN, this.handleMouseDown_);
	this.addListener(goog.events.EventType.MOUSEUP, this.handleMouseUp_);
};

/**
 * Installs styles if needed. Only writes styles when they can't be written
 * inline directly into the field.
 * 
 * @protected
 */
jchemhub.view.ReactionEditor.prototype.installStyles = function() {
	if (this.cssStyles && this.shouldLoadAsynchronously()) {
		goog.style.installStyles(this.cssStyles, this.getElement());
	}
};

/**
 * Start change events again and fire once if desired.
 * 
 * @param {boolean=}
 *            opt_fireChange Whether to fire the change event immediately.
 * @param {boolean=}
 *            opt_fireDelayedChange Whether to fire the delayed change event
 *            immediately.
 */
jchemhub.view.ReactionEditor.prototype.startChangeEvents = function(
		opt_fireChange, opt_fireDelayedChange) {

	if (!opt_fireChange && this.changeTimerGecko_) {
		// In the case where change events were stopped and we're not firing
		// them on start, the user was trying to suppress all change or delayed
		// change events. Clear the change timer now while the events are still
		// stopped so that its firing doesn't fire a stopped change event, or
		// queue up a delayed change event that we were trying to stop.
		this.changeTimerGecko_.fireIfActive();
	}

	this.startEvent(jchemhub.view.ReactionEditor.EventType.CHANGE);
	this.startEvent(jchemhub.view.ReactionEditor.EventType.DELAYEDCHANGE);
	if (opt_fireChange) {
		this.handleChange();
	}

	if (opt_fireDelayedChange) {
		this.dispatchDelayedChange_();
	}
};

/**
 * Frequency to check for selection changes.
 * 
 * @type {number}
 * @private
 */
jchemhub.view.ReactionEditor.SELECTION_CHANGE_FREQUENCY_ = 250;

/**
 * A default configuration for the reaction editor.
 */
jchemhub.view.ReactionEditor.defaultConfig = {
	arrow : {
		stroke : {
			width : 2,
			color : "black"
		}
	},
	atom : {
		diameter : .05,
		stroke : {
			width : 1,
			color : '#FF9999'
		},
		fill : {
			color : '#FF9999'
		},
		fontName : "Arial"
	},
	N : {
		stroke : {
			width : 1,
			color : 'blue'
		},
		fill : {
			color : 'blue'
		}
	},
	O : {
		stroke : {
			width : 1,
			color : 'red'
		},
		fill : {
			color : 'red'
		}
	},
	S : {
		stroke : {
			width : 1,
			color : 'yellow'
		},
		fill : {
			color : 'yellow'
		}
	},
	P : {
		stroke : {
			width : 1,
			color : 'orange'
		},
		fill : {
			color : 'orange'
		}
	},
	Cl : {
		stroke : {
			width : 1,
			color : 'green'
		},
		fill : {
			color : 'green'
		}
	},
	F : {
		stroke : {
			width : 1,
			color : 'green'
		},
		fill : {
			color : 'green'
		}
	},
	Br : {
		stroke : {
			width : 1,
			color : 'dark red'
		},
		fill : {
			color : 'dark red'
		}
	},
	I : {
		stroke : {
			width : 1,
			color : 'purple'
		},
		fill : {
			color : 'purple'
		}
	},
	C : {
		stroke : {
			width : 1,
			color : 'black'
		},
		fill : {
			color : 'black'
		}
	},
	H : {
		stroke : {
			width : 1,
			color : 'black'
		},
		fill : {
			color : 'white'
		}
	},
	background : {
		color : '#F0FFF0'
	},
	margin : 20,
	subscriptSize : 5,
	bond : {
		stroke : {
			width : 2,
			color : 'black'
		},
		fill : {
			color : 'black'
		}
	},
	highlight : {
		radius : .1,
		color : 'blue'
	},
	plus : {
		stroke : {
			width : 2,
			color : "black"
		}
	}
};
