goog.provide('chem.view.Drawing');

/**
 * An abstract base class for a drawing element in the reaction editor. .
 * 
 * @constructor
 */
chem.view.Drawing = function() {
	this._parent = null;
	this._children = [];
	this._group = null;
	this._config = null;
	this._transform = null;
};

/**
 * renders the drawing, meant to be overridden
 */
chem.view.Drawing.prototype.render = goog.abstractMethod;

/**
 * layout drawing and all children
 */
chem.view.Drawing.prototype.layout = function(transform){
	console.log("layout");
	this.setTransform(transform);
	this.layoutChildren(transform);
}

/**
 * render the children
 */
chem.view.Drawing.prototype.renderChildren = function() {
	goog.array.forEach(this.getChildren(), function(child) {
		child.render();
	}, this);
}

/**
 * layout drawing and children
 */
chem.view.Drawing.prototype.layoutChildren = function(transform) {
	goog.array.forEach(this.getChildren(), function(child) {
		child.layout(transform);
	}, this);
}

/**
 * gets the children of this Drawing
 * 
 */
chem.view.Drawing.prototype.getChildren = function() {
	return this._children;
}

/**
 * adds a Drawing as a child to the current Drawing
 * 
 * @constructor
 * @param chem.view.Drawing
 */
chem.view.Drawing.prototype.add = function(child) {
	child.setParent(this);
	this._children.push(child);
};

/**
 * Removes a child.
 * 
 * @param {chem.view.Drawing}
 *            child The child to remove.
 * @return {chem.view.Drawing} The child that was removed.
 */
chem.view.Drawing.prototype.removeChild = function(child) {
	if (child.getParent() != this) {
		throw Error('Can only remove children');
	}
	 goog.array.remove(this._children, child);
	 child.setParent(null);
	 return child;
};

/**
 * get graphics from parent
 * 
 * @type {goog.AbstractGraphics}
 */
chem.view.Drawing.prototype.getGraphics = function() {
	if (!this._graphics) {
		this._graphics = this.getParent().getGraphics();
	}
	return this._graphics;
};

/**
 * get parent
 * 
 * @type {chem.view.Drawing}
 */

chem.view.Drawing.prototype.getParent = function() {
	return this._parent;
};

/**
 * set parent
 * 
 * @param chem.view.Drawing
 */
chem.view.Drawing.prototype.setParent = function(parent) {
	  if (this == parent) {
		    // Attempting to add a child to itself is an error.
		    throw Error(chem.view.Drawing.PARENT_UNABLE_TO_BE_SET);
		  }
	  if(this._parent && this._parent!=parent){
		  this._parent.removeChild(this);
	  }
	  this._parent = parent;
}

/**
 * get graphics group, creating it if needed
 * 
 * @type{goog.graphics.GroupElement}
 */
chem.view.Drawing.prototype.getGroup = function() {
	if (!this._group) {
		this._group = this.getGraphics().createGroup();
		this._group.drawing = this;
	}
	return this._group;
};

/**
 * get config from parent
 * 
 */
chem.view.Drawing.prototype.getConfig = function() {
	if (!this._config) {
		this._config = this.getParent().getConfig();
	}
	return this._config;
};

/**
 * get transform
 * 
 * @return{goog.graphics.AffineTransform}
 */
chem.view.Drawing.prototype.getTransform = function() {
	return this._transform;
};

/**
 * set transform
 * 
 * @param {goog.graphics.AffineTransform}
 */
chem.view.Drawing.prototype.setTransform = function(transform) {
	this._transform = transform
};




/**
 * TTD:  this probably should be an extension of AffileTransform
 * transform array of coordinates 
 * @param {!Array.<goog.math.Coordinate>}
 * @return {!Array.<goog.math.Coordinate>}
 */
chem.view.Drawing.prototype.transformCoords=function(trans, source_coords){
	var pairs = goog.array.map(source_coords, function(coord){
		return [coord.x, coord.y];
	});
	var source_points = goog.array.flatten(pairs);
	var dest_points = [];
	trans.transform(source_points, 0, dest_points, 0, source_points.length/2)

	var dest_coords=[];
	for(var i=0;i<dest_points.length;i+=2){
		dest_coords.push(new goog.math.Coordinate(dest_points[i], dest_points[i+1]));
	};
	return dest_coords;
};

/**
 * Errors thrown by the drawing.
 * 
 * @enum {string}
 */
chem.view.Drawing.Error = {

		  /**
			 * Error when an attempt is made to set the parent of a drawing in a
			 * way that would result in an inconsistent object graph.
			 */
		  PARENT_UNABLE_TO_BE_SET: 'Unable to set parent component',
};



