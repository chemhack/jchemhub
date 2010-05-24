goog.provide('jchemhub.view.AtomRenderer');

/**
 * Class to render an atom object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.AtomRenderer = function(graphics, opt_config) {
	jchemhub.view.Renderer.call(this, graphics, opt_config);
}
goog.inherits(jchemhub.view.AtomRenderer, jchemhub.view.Renderer);

jchemhub.view.AtomRenderer.prototype.render = function(atom, transform){
	
}