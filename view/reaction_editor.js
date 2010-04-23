goog.provide("jchemhub.view.ReactionEditor");
goog.require("jchemhub.view.Drawing");
goog.require("goog.graphics");

/**
 * A graphical editor for reactions
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.ReactionEditor = function(element, opt_config) {
	jchemhub.view.Drawing.call(this);
	this._element = element;
	this._config = new goog.structs.Map(jchemhub.view.ReactionEditor.defaultConfig);
	if (opt_config) {
		this._config.addAll(opt_config); // merge optional config into
		// defaults
	}
	this._graphics = goog.graphics.createGraphics(element.clientWidth,
			element.clientHeight);
	this._graphics.render(this._element);
};
goog.inherits(jchemhub.view.ReactionEditor, jchemhub.view.Drawing);

/**
 * layout and render
 */

jchemhub.view.ReactionEditor.prototype.layoutAndRender = function() {

	// center children vertically on editor graphics
	var size = this.getGraphics().getSize();
	var transform = goog.graphics.AffineTransform.getTranslateInstance(0,
			size.height / 2);
	// console.log("center height");
	// console.log(transform);
	this.layout(transform);
	this.render();
}

/**
 * render this drawing and all its children
 */
jchemhub.view.ReactionEditor.prototype.render = function() {
	this.renderChildren();
}

/**
 * A default configuration for the reaction editor.
 */
jchemhub.view.ReactionEditor.defaultConfig = {
	arrow : {
		width : 3,
		height : 1,
		stroke : {
			width : 1,
			color : "black"
		}
	},
	atom : {
		diameter : .05,
		stroke : {
			width : 1,
			color : 'blue'
		},

		fill : {
			color : 'blue'
		}
	},
	bond : {
		stroke : {
			width : 1,
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
		width : 1,
		stroke : {
			width : 1,
			color : "black"
		}
	}
};
