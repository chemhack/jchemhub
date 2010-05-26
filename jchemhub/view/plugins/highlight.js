
goog.provide('jchemhub.view.plugins.Highlight');
goog.require('jchemhub.view.Plugin');
goog.require('goog.functions');


/**
 * simple Plugin for highlighting bonds and atoms
 *
 * @constructor
 * @extends {jchemhub.view.Plugin}
 */
jchemhub.view.plugins.Highlight = function() {
  jchemhub.view.Plugin.call(this);
};
goog.inherits(jchemhub.view.plugins.Highlight, jchemhub.view.Plugin);


/** The clear command. */
jchemhub.view.plugins.Highlight.COMMAND = 'highlight';


/** @inheritDoc */
jchemhub.view.plugins.Highlight.prototype.getTrogClassId =
    goog.functions.constant(jchemhub.view.plugins.Highlight.COMMAND);


/** @inheritDoc */
jchemhub.view.plugins.Highlight.prototype.isSupportedCommand = function(
    command) {
  return command == jchemhub.view.plugins.Highlight.COMMAND;
};

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.plugins.Highlight.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.plugins.Highlight');


jchemhub.view.plugins.Highlight.prototype.handleAtomMouseOver = function(e) {

};
jchemhub.view.plugins.Highlight.prototype.handleAtomMouseOut = function(e) {
	
};

jchemhub.view.plugins.Highlight.prototype.handleBondMouseOver = function(e) {
	if (!e.currentTarget.bondHighlightGroup) {
		e.currentTarget.bondHighlightGroup = this.highlightOn(e.bond);
	} else {
		e.currentTarget.bondHighlightGroup = this.highlightOn(e.bond, e.currentTarget.bondHighlightGroup);
	}
};
jchemhub.view.plugins.Highlight.prototype.handleBondMouseOut = function(e) {

	if (e.currentTarget.bondHighlightGroup) {
		e.currentTarget.bondHighlightGroup.clear();
	}
};

jchemhub.view.plugins.Highlight.prototype.highlightOn = function(bond, opt_group){
	return this.editorObject.reactionRenderer.moleculeRenderer.bondRendererFactory.get(bond).highlightOn(bond, opt_group);
}
