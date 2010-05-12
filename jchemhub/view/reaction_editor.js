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
	this._graphics.clear();
	var fill = new goog.graphics.SolidFill(
			this.getConfig().get("background").color);

	this._graphics.drawRect(0, 0, this._element.clientWidth, this._element.clientHeight,
			null, fill);
}

jchemhub.view.ReactionEditor.prototype.setModel = function(model) {
	this.clear();
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
	margin = 20; // how to get from config?
	this.layout(new goog.math.Rect(margin, margin, this.getSize().width
			- margin * 2, this.getSize().height - margin * 2));
	this.render();
}

/*
 * @override @return {goog.math.Rect}
 */
jchemhub.view.ReactionEditor.prototype.getRect = function() {
	return new goog.math.Rect(0, 0, this._graphics.getSize().width,
			this._graphics.getSize().height);
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
	var children = this.getChildren();

	return this.getChildren()[0]
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
	margin : 10,
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
