goog.provide("jchemhub.view.ReactionEditor");
goog.require("jchemhub.view.Drawing");
goog.require("goog.graphics");
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');

/**
 * A graphical editor for reactions
 * 
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.ReactionEditor = function(element, opt_config) {
	jchemhub.view.Drawing.call(this);
	this._element = element;
	this._config = new goog.structs.Map(
			jchemhub.view.ReactionEditor.defaultConfig);
	if (opt_config) {
		this._config.addAll(opt_config); // merge optional config into
		// defaults
	}

	this._graphics = goog.graphics.createGraphics(element.clientWidth,
			element.clientHeight);

	this._graphics.render(this._element);

};
goog.inherits(jchemhub.view.ReactionEditor, jchemhub.view.Drawing);

jchemhub.view.ReactionEditor.prototype.clear = function() {
	jchemhub.view.ReactionEditor.superClass_.clear.call(this);
	this._graphics.clear();
	this.model = null;
	var fill = new goog.graphics.SolidFill(
			this.getConfig().get("background").color);

	this._graphics.drawRect(0, 0, this._element.clientWidth, this._element.clientHeight,
			null, fill);
}

jchemhub.view.ReactionEditor.prototype.setModel = function(model) {
	this.clear();
	this.model = model;
	if (model instanceof jchemhub.model.Reaction) {
		this.add(new jchemhub.view.ReactionDrawing(model));
	}
	if (model instanceof jchemhub.model.Molecule) {
		this.add(new jchemhub.view.MoleculeDrawing(model));
	}
}

/**
 * layout and render
 */

jchemhub.view.ReactionEditor.prototype.layoutAndRender = function() {
	var margin = this.getConfig().get("margin");
	this.layout(new goog.math.Rect(margin, margin, this.getGraphics().width
			- margin * 2, this.getGraphics().height - margin * 2));
	this.render();
}

/**
 * set up transform to layout drawing and all children to fit rectangle
 * 
 * @param rect
 *            {goog.math.Rect}
 */
jchemhub.view.ReactionEditor.prototype.layout = function(to_rect) {

	var from_rect = this.getRect();
	// preserve aspect ratio
	var to_size = from_rect.getSize().scaleToFit(to_rect.getSize());
	var scale = to_size.width / from_rect.width
	var dx = to_rect.left - (from_rect.left * scale);
	var dy = to_rect.top - (from_rect.top * scale);
	this.setTransform(new goog.graphics.AffineTransform(scale, 0, 0, scale, dx,
			dy));

};

/*
 * @override 
 * @return {goog.math.Rect}
 */
jchemhub.view.ReactionEditor.prototype.getRect = function() {
	var child = this.getChildren()[0];
	return child.getRect();
	
};

/**
 * get transform
 * 
 * @return{goog.graphics.AffineTransform}
 */
jchemhub.view.ReactionEditor.prototype.getTransform = function() {
	return this._transform;
}


/**
 * render this drawing and all its children
 */
jchemhub.view.ReactionEditor.prototype.render = function() {
	this.renderChildren();
}

/**
 * gets model from contained reaction drawing
 * 
 * @return{jchemhub.model.Reaction | jchemhub.model.Molecule}
 */
jchemhub.view.ReactionEditor.prototype.getModel = function() {
	return this.model;
}

/**
 * A default configuration for the reaction editor.
 */
jchemhub.view.ReactionEditor.defaultConfig = {
	arrow : {
		stroke : {
			width : 2,
			color : "black"
		}
	},
	atom : {
		diameter : .05,
		stroke : {
			width : 1,
			color : '#FF9999'
		},
		fill : {
			color : '#FF9999'
		},
		fontName : "Arial"
	},
	N : {
		stroke : {
			width : 1,
			color : 'blue'
		},
		fill : {
			color : 'blue'
		}
	},
	O : {
		stroke : {
			width : 1,
			color : 'red'
		},
		fill : {
			color : 'red'
		}
	},
	S : {
		stroke : {
			width : 1,
			color : 'yellow'
		},
		fill : {
			color : 'yellow'
		}
	},
	P : {
		stroke : {
			width : 1,
			color : 'orange'
		},
		fill : {
			color : 'orange'
		}
	},
	Cl : {
		stroke : {
			width : 1,
			color : 'green'
		},
		fill : {
			color : 'green'
		}
	},
	F : {
		stroke : {
			width : 1,
			color : 'green'
		},
		fill : {
			color : 'green'
		}
	},
	Br : {
		stroke : {
			width : 1,
			color : 'dark red'
		},
		fill : {
			color : 'dark red'
		}
	},
	I : {
		stroke : {
			width : 1,
			color : 'purple'
		},
		fill : {
			color : 'purple'
		}
	},
	C : {
		stroke : {
			width : 1,
			color : 'black'
		},
		fill : {
			color : 'black'
		}
	},
	H : {
		stroke : {
			width : 1,
			color : 'black'
		},
		fill : {
			color : 'white'
		}
	},
	background : {
		color : '#F0FFF0'
	},
	margin : 20,
	subscriptSize : 5,
	bond : {
		stroke : {
			width : 2,
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
		stroke : {
			width : 2,
			color : "black"
		}
	}
};
