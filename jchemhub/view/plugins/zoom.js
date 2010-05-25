goog.provide('jchemhub.view.plugins.Zoom');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{jchemhubn.view.Plugin}s
 */
jchemhub.view.plugins.Zoom = function(){
	  jchemhub.view.Plugin.call(this);
}
goog.inherits(jchemhub.view.plugins.Zoom, jchemhub.view.Plugin);

/**
 * Commands implemented by this plugin.
 * @enum {string}
 */
jchemhub.view.plugins.Zoom.COMMAND = {
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut'
};

/**
 * Inverse map of execCommand strings to
 * {@link jchemhub.view.plugins.Zoom.COMMAND} constants. Used to determine
 * whether a string corresponds to a command this plugin handles 
 * @type {Object}
 * @private
 */
jchemhub.view.plugins.Zoom.SUPPORTED_COMMANDS_ =
    goog.object.transpose(jchemhub.view.plugins.Zoom.COMMAND);

/** @inheritDoc */
jchemhub.view.plugins.Zoom.prototype.getTrogClassId =
    goog.functions.constant(jchemhub.view.plugins.Zoom.COMMAND);


/** @inheritDoc */
jchemhub.view.plugins.Zoom.prototype.isSupportedCommand = function(command) {
  return command in jchemhub.view.plugins.Zoom.SUPPORTED_COMMANDS_;
};


/** @inheritDoc */
jchemhub.view.plugins.Zoom.prototype.execCommand = function(command,
    var_args) {
	var current = this.editorObject.getScaleFactor();
  if (command == jchemhub.view.plugins.Zoom.COMMAND.ZOOM_IN) {
	  this.editorObject.setScaleFactor(current*1.1);  
  } else if (command == jchemhub.view.plugins.Zoom.COMMAND.ZOOM_OUT) {
	  this.editorObject.setScaleFactor(current*0.9);
  }

  this.editorObject.setModel(this.editorObject.getModel());
};


/**
 * The logger for this class.
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.plugins.Zoom.prototype.logger =
    goog.debug.Logger.getLogger('jchemhub.view.plugins.Zoom');