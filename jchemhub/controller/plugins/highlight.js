
goog.provide('jchemhub.controller.plugins.Highlight');
goog.require('jchemhub.controller.Plugin');
goog.require('goog.functions');
goog.require('goog.debug.Logger');


/**
 * simple Plugin for highlighting bonds and atoms
 *
 * @constructor
 * @extends {jchemhub.controller.Plugin}
 */
jchemhub.controller.plugins.Highlight = function() {
  jchemhub.controller.Plugin.call(this);
};
goog.inherits(jchemhub.controller.plugins.Highlight, jchemhub.controller.Plugin);


/** @inheritDoc */
jchemhub.controller.plugins.Highlight.prototype.getTrogClassId =
    goog.functions.constant('jchemhub.controller.plugins.Highlight');

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.Highlight.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.Highlight');


jchemhub.controller.plugins.Highlight.prototype.handleAtomMouseOver = function(e) {

};
jchemhub.controller.plugins.Highlight.prototype.handleAtomMouseOut = function(e) {
	
};

jchemhub.controller.plugins.Highlight.prototype.handleBondMouseOver = function(e) {
	if (!e.currentTarget.bondHighlightGroup) {
		e.currentTarget.bondHighlightGroup = this.highlightOn(e.bond);
	} else {
		e.currentTarget.bondHighlightGroup = this.highlightOn(e.bond, e.currentTarget.bondHighlightGroup);
	}
};
jchemhub.controller.plugins.Highlight.prototype.handleBondMouseOut = function(e) {

	if (e.currentTarget.bondHighlightGroup) {
		e.currentTarget.bondHighlightGroup.clear();
	}
};

jchemhub.controller.plugins.Highlight.prototype.highlightOn = function(bond, opt_group){
	return this.editorObject.reactionRenderer.moleculeRenderer.bondRendererFactory.get(bond).highlightOn(bond, opt_group);
}
