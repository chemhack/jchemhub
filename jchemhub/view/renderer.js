goog.provide("jchemhub.view.Renderer");
goog.require("goog.structs.Map");


/**
 * Abstract Class to render a model object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.Renderer = function(parentEventTarget, graphics, opt_config, defaultConfig) {
	this.parentEventTarget = parentEventTarget;
	this.graphics = graphics;

	this.config = new goog.structs.Map(defaultConfig);
	if (opt_config) {
		this.config.addAll(opt_config); // merge optional config into
		// defaults
	}
}

jchemhub.view.Renderer.prototype.render = goog.abstractMethod;