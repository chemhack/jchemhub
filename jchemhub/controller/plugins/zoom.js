goog.provide('jchemhub.controller.plugins.Zoom');
goog.require('goog.debug.Logger');

goog.exportSymbol('jchemhub.controller.plugins.Zoom.COMMAND.ZOOM_IN', jchemhub.controller.plugins.Zoom.COMMAND.ZOOM_IN);
goog.exportSymbol('jchemhub.controller.plugins.Zoom.COMMAND.ZOOM_OUT', jchemhub.controller.plugins.Zoom.COMMAND.ZOOM_OUT);

/**
 * @constructor
 * @extends{jchemhubn.controller.Plugin}s
 */
jchemhub.controller.plugins.Zoom = function(){
	  jchemhub.controller.Plugin.call(this);
}
goog.inherits(jchemhub.controller.plugins.Zoom, jchemhub.controller.Plugin);

/**
 * Commands implemented by this plugin.
 * @enum {string}
 */
jchemhub.controller.plugins.Zoom.COMMAND = {
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut'
};

/**
 * Inverse map of execCommand strings to
 * {@link jchemhub.controller.plugins.Zoom.COMMAND} constants. Used to determine
 * whether a string corresponds to a command this plugin handles 
 * @type {Object}
 * @private
 */
jchemhub.controller.plugins.Zoom.SUPPORTED_COMMANDS_ =
    goog.object.transpose(jchemhub.controller.plugins.Zoom.COMMAND);

/** @inheritDoc */
jchemhub.controller.plugins.Zoom.prototype.getTrogClassId =
    goog.functions.constant(jchemhub.controller.plugins.Zoom.COMMAND);


/** @inheritDoc */
jchemhub.controller.plugins.Zoom.prototype.isSupportedCommand = function(command) {
  return command in jchemhub.controller.plugins.Zoom.SUPPORTED_COMMANDS_;
};


/** @inheritDoc */
jchemhub.controller.plugins.Zoom.prototype.execCommand = function(command,
    var_args) {
	var current = this.editorObject.getScaleFactor();
  if (command == jchemhub.controller.plugins.Zoom.COMMAND.ZOOM_IN) {
	  this.editorObject.setScaleFactor(current*1.1);  
  } else if (command == jchemhub.controller.plugins.Zoom.COMMAND.ZOOM_OUT) {
	  this.editorObject.setScaleFactor(current*0.9);
  }

  this.editorObject.setModel(this.editorObject.getModel());
};


/**
 * The logger for this class.
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.Zoom.prototype.logger =
    goog.debug.Logger.getLogger('jchemhub.controller.plugins.Zoom');