goog.provide('jchemhub.controller.ToolbarController');

goog.require('jchemhub.controller.ReactionEditor.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.ui.Component.EventType');


/**
 * A class for managing the editor toolbar.  Acts as a bridge between
 * a {@link jchemhub.controller.ReactionEditor} and a {@link goog.ui.Toolbar}.
 *
 * The {@code toolbar} argument must be an instance of {@link goog.ui.Toolbar}
 * or a subclass.  This class doesn't care how the toolbar was created.  As
 * long as one or more controls hosted  in the toolbar have IDs that match
 * built-in {@link jchemhub.controller.ReactionEditor.Command}s, they will function as expected.  It is
 * the caller's responsibility to ensure that the toolbar is already rendered
 * or that it decorates an existing element.
 *
 *
 * @param {!jchemhub.controller.ReactionEditor} editor to be controlled by the
 *     toolbar.
 * @param {!goog.ui.Toolbar} toolbar Toolbar to control the editable editor.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.controller.ToolbarController = function(editor, toolbar) {
  goog.events.EventTarget.call(this);

  /**
   * Event handler to listen for editor events and user actions.
   * @type {!goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * The editor instance controlled by the toolbar.
   * @type {!jchemhub.controller.ToolbarController}
   * @private
   */
  this.editor_ = editor;

  /**
   * The toolbar that controls the editor.
   * @type {!goog.ui.Toolbar}
   * @private
   */
  this.toolbar_ = toolbar;

  /**
   * Editing commands whose state is to be queried when updating the toolbar.
   * @type {!Array.<string>}
   * @private
   */
  this.queryCommands_ = [];

  // Iterate over all buttons, and find those which correspond to
  // queryable commands. Add them to the list of commands to query on
  // each COMMAND_VALUE_CHANGE event.
  this.toolbar_.forEachChild(function(button) {
    if (button.queryable) {
      this.queryCommands_.push(this.getComponentId(button.getId()));
    }
  }, this);

  // Make sure the toolbar doesn't steal keyboard focus.
  this.toolbar_.setFocusable(false);

  // Hook up handlers that update the toolbar in response to editor events,
  // and to execute editor commands in response to toolbar events.
  this.handler_.
      listen(this.editor_, jchemhub.controller.ReactionEditor.EventType.COMMAND_VALUE_CHANGE,
          this.updateToolbar).
      listen(this.toolbar_, goog.ui.Component.EventType.ACTION,
          this.handleAction);
};
goog.inherits(jchemhub.controller.ToolbarController, goog.events.EventTarget);


/**
 * Returns the Closure component ID of the control that corresponds to the
 * given {@link jchemhub.controller.Command} constant.
 * Subclasses may override this method if they want to use a custom mapping
 * scheme from commands to controls.
 * @param {string} command Editor command.
 * @return {string} Closure component ID of the corresponding toolbar
 *     control, if any.
 * @protected
 */
jchemhub.controller.ToolbarController.prototype.getComponentId = function(command) {
  // The default implementation assumes that the component ID is the same as
  // the command constant.
  return command;
};


/**
 * Returns the {@link jchemhub.controller.Command} constant
 * that corresponds to the given Closure component ID.  Subclasses may override
 * this method if they want to use a custom mapping scheme from controls to
 * commands.
 * @param {string} id Closure component ID of a toolbar control.
 * @return {string} Editor command or dialog constant corresponding to the
 *     toolbar control, if any.
 * @protected
 */
jchemhub.controller.ToolbarController.prototype.getCommand = function(id) {
  // The default implementation assumes that the component ID is the same as
  // the command constant.
  return id;
};


/**
 * Returns the event handler object for the editor toolbar.  Useful for classes
 * that extend {@code jchemhub.controller.ToolbarController}.
 * @return {!goog.events.EventHandler} The event handler object.
 * @protected
 */
jchemhub.controller.ToolbarController.prototype.getHandler = function() {
  return this.handler_;
};


/**
 * Returns the editor instance managed by the toolbar.  Useful for
 * classes that extend {@code jchemhub.controller.ToolbarController}.
 * @return {!jchemhub.controller.ReactionEditor} The editor managed by the toolbar.
 * @protected
 */
jchemhub.controller.ToolbarController.prototype.getEditor= function() {
  return this.editor_;
};


/**
 * Returns the toolbar UI component that manages the editor.  Useful for
 * classes that extend {@code jchemhub.controller.ToolbarController}.
 * @return {!goog.ui.Toolbar} The toolbar UI component.
 */
jchemhub.controller.ToolbarController.prototype.getToolbar = function() {
  return this.toolbar_;
};


/**
 * @return {boolean} Whether the toolbar is visible.
 */
jchemhub.controller.ToolbarController.prototype.isVisible = function() {
  return this.toolbar_.isVisible();
};


/**
 * Shows or hides the toolbar.
 * @param {boolean} visible Whether to show or hide the toolbar.
 */
jchemhub.controller.ToolbarController.prototype.setVisible = function(visible) {
  this.toolbar_.setVisible(visible);
};


/**
 * @return {boolean} Whether the toolbar is enabled.
 */
jchemhub.controller.ToolbarController.prototype.isEnabled = function() {
  return this.toolbar_.isEnabled();
};


/**
 * Enables or disables the toolbar.
 * @param {boolean} enabled Whether to enable or disable the toolbar.
 */
jchemhub.controller.ToolbarController.prototype.setEnabled = function(enabled) {
  this.toolbar_.setEnabled(enabled);
};


/**
 * Programmatically blurs the editor toolbar, un-highlighting the currently
 * highlighted item, and closing the currently open menu (if any).
 */
jchemhub.controller.ToolbarController.prototype.blur = function() {
  // We can't just call this.toolbar_.getElement().blur(), because the toolbar
  // element itself isn't focusable, so goog.ui.Container#handleBlur isn't
  // registered to handle blur events.
  this.toolbar_.handleBlur(null);
};


/** @inheritDoc */
jchemhub.controller.ToolbarController.prototype.disposeInternal = function() {
  jchemhub.controller.ToolbarController.superClass_.disposeInternal.call(this);
  if (this.handler_) {
    this.handler_.dispose();
    delete this.handler_;
  }
  if (this.toolbar_) {
    this.toolbar_.dispose();
    delete this.toolbar_;
  }
  delete this.editor_;
  delete this.queryCommands_;
};


/**
 * Updates the toolbar in response to editor events.  Specifically, updates
 * button states based on {@code COMMAND_VALUE_CHANGE} events, reflecting the
 * effective formatting of the selection.
 * @param {goog.events.Event} e Editor event to handle.
 * @protected
 */
jchemhub.controller.ToolbarController.prototype.updateToolbar = function(e) {
  if (!this.toolbar_.isEnabled() ||
      !this.dispatchEvent(goog.ui.Component.EventType.CHANGE)) {
    return;
  }

  var state;

  /** @preserveTry */
  try {
    /** @type {Array.<string>} */
    e.commands; // Added by dispatchEvent.

    // If the COMMAND_VALUE_CHANGE event specifies which commands changed
    // state, then we only need to update those ones, otherwise update all
    // commands.
    state = /** @type {Object} */ (
        this.editor_.queryCommandValue(e.commands || this.queryCommands_));
  } catch (ex) {
    // TODO: Find out when/why this happens.
    state = {};
  }

  this.updateToolbarFromState(state);
};


/**
 * Updates the toolbar to reflect a given state.
 * @param {Object} state Object mapping editor commands to values.
 */
jchemhub.controller.ToolbarController.prototype.updateToolbarFromState =
    function(state) {
  for (var command in state) {
    var button = this.toolbar_.getChild(this.getComponentId(command));
    if (button) {
      var value = state[command];
      if (button.updateFromValue) {
        button.updateFromValue(value);
      } else {
        button.setChecked(!!value);
      }
    }
  }
};


/**
 * Handles {@code ACTION} events dispatched by toolbar buttons in response to
 * user actions by executing the corresponding editor command.
 * @param {goog.events.Event} e Action event to handle.
 * @protected
 */
jchemhub.controller.ToolbarController.prototype.handleAction = function(e) {
  var command = this.getCommand(e.target.getId());
  this.editor_.execCommand(command, e.target.getValue());
};
