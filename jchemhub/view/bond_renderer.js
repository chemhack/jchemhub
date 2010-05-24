goog.provide('jchemhub.view.BondRenderer');

/**
 * Class to render a bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.BondRenderer = function(graphics, opt_config) {
	jchemhub.view.Renderer.call(this, graphics, opt_config);

}
goog.inherits(jchemhub.view.BondRenderer, jchemhub.view.Renderer);

jchemhub.view.BondRenderer.prototype.render = function(bond, transform){
	
}