goog.provide("chem.view.ReactionEditor");
goog.require("chem.view.Drawing");
goog.require("goog.graphics");

/**
 * A graphical editor for reactions
 * 
 * @param {chem.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {chem.view.Drawing}
 */
chem.view.ReactionEditor = function(element, opt_config) {
	chem.view.Drawing.call(this);
	this._element = element;
	this._config = new goog.structs.Map(chem.view.ReactionEditor.defaultConfig);
	if(opt_config){
		this._config.addAll(opt_config); // merge optional config into
											// defaults
	}
	this._graphics = goog.graphics.createGraphics(this.getConfig().get("width"), this.getConfig().get("height"));
	this._graphics.render(this._element);
};
goog.inherits(chem.view.ReactionEditor, chem.view.Drawing);


/**
 * layout and render
 */

chem.view.ReactionEditor.prototype.layoutAndRender = function(){
	
	// center children vertically on editor graphics
	var size = this.getGraphics().getSize();	
	var transform = goog.graphics.AffineTransform.getTranslateInstance(0, size.height/2);
//	console.log("center height");
//	console.log(transform);
	this.layout(transform);
	this.render();
}

/**
 * render this drawing and all its children
 */
chem.view.ReactionEditor.prototype.render = function(){
	this.renderChildren();
}

/**
 * A default configuration for the reaction editor.
 */
chem.view.ReactionEditor.defaultConfig = {
	atom: {
	diameter: .05,
	stroke : {
		width: 1,
		color: 'blue'
		},
	
	fill : {
		color : 'blue',
		},
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
	width: 400,
	height: 400,
	highlight:{
		radius: .1,
		color: 'blue'
	},
};

