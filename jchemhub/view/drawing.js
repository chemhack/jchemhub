goog.provide('jchemhub.view.Drawing');
goog.require('goog.Disposable');
goog.require('goog.events.EventTarget');

/**
 * An abstract base class for a drawing element in the reaction editor. .
 * 
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.view.Drawing = function() {
	goog.events.EventTarget.call(this);
	this._parent = null;
	this._children = [];
	this._group = null;
	this._config = null;
	this._transform = null;
	this._elements = [];

	/**
	 * @type {!goog.events.EventHandler}
	 * @protected
	 */
	this.handler = new goog.events.EventHandler(this);
};
goog.inherits(jchemhub.view.Drawing, goog.events.EventTarget);

/**
 * renders the drawing, meant to be overridden
 */
jchemhub.view.Drawing.prototype.render = goog.abstractMethod;

/**
 * render the children
 */
jchemhub.view.Drawing.prototype.renderChildren = function() {
	goog.array.forEach(this.getChildren(), function(child) {
		child.render();
	}, this);

};

/**
 * set up transform to layout drawing and all children to fit rectangle
 * 
 * @param rect
 *            {goog.math.Rect}
 */
jchemhub.view.Drawing.prototype.layout = function(to_rect) {

	var from_rect = this.getRect();
	// preserve aspect ratio
	var to_size = from_rect.getSize().scaleToFit(to_rect.getSize());
	var scale = to_size.width / from_rect.width
	var dx = to_rect.left - (from_rect.left * scale);
	var dy = to_rect.top - (from_rect.top * scale);
	this.setTransform(new goog.graphics.AffineTransform(scale, 0, 0, scale, dx,
			dy));
	this.layoutChildren(to_rect);
};

/**
 * array of all coordinates contained by this drawing
 * 
 * @return
 */
jchemhub.view.Drawing.prototype.getCoords = function() {
	var coords = []
	goog.array.forEach(this.getChildren(), function(child) {
		coords.push.apply(coords, child.getCoords());
	});
	return coords;
};

/**
 * get bounding box of this drawing
 * 
 * @return {goog.math.Box}
 */
jchemhub.view.Drawing.prototype.getBoundingBox = function() {
	return goog.math.Box.boundingBox.apply(null, this.getCoords());
};

/**
 * get rectangle bounding all the coordinates contained in this drawing
 * 
 * @return
 */
jchemhub.view.Drawing.prototype.getRect = function() {
	var bbox = this.getBoundingBox();
	return goog.math.Rect.createFromBox(bbox);
}

/**
 * size of drawing
 * 
 * @return {goog.math.Size}
 */
jchemhub.view.Drawing.prototype.getSize = function() {
	var r = this.getRect();
	return r.getSize();
}

jchemhub.view.Drawing.prototype.getTotalChildrenWidth = function() {
	return goog.array.reduce(this.getChildren(), function(r, v, i, arr) {
		return r + v.getSize().width;
	}, 0);
}

jchemhub.view.Drawing.prototype.getMaxChildrenHeight = function() {
	return goog.array.reduce(this.getChildren(), function(r, v, i, arr) {
		return Math.max(r, v.getSize().height);
	}, 0);
};

/**
 * layout children
 */
jchemhub.view.Drawing.prototype.layoutChildren = function(rect) {
	goog.array.forEach(this.getChildren(), function(child) {
		child.layout(rect);
	});
};

/**
 * gets the children of this Drawing
 * 
 */
jchemhub.view.Drawing.prototype.getChildren = function() {
	return this._children;
};

/**
 * adds a Drawing as a child to the current Drawing
 * 
 * @param {jchemhub.view.Drawing}
 *            the child to add
 */
jchemhub.view.Drawing.prototype.add = function(child) {
	child.setParent(this);
	this._children.push(child);

};

/**
 * Removes a child.
 * 
 * @param {jchemhub.view.Drawing}
 *            child The child to remove.
 * @return {jchemhub.view.Drawing} The child that was removed.
 */
jchemhub.view.Drawing.prototype.removeChild = function(child) {
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
jchemhub.view.Drawing.prototype.getGraphics = function() {
	if (!this._graphics) {
		this._graphics = this.getParent().getGraphics();
	}
	return this._graphics;
};

/**
 * get parent
 * 
 * @type {jchemhub.view.Drawing}
 */

jchemhub.view.Drawing.prototype.getParent = function() {
	return this._parent;
};

/**
 * set parent
 * 
 * @param jchemhub.view.Drawing
 */
jchemhub.view.Drawing.prototype.setParent = function(parent) {
	if (this == parent) {
		// Attempting to add a child to itself is an error.
		throw Error(jchemhub.view.Drawing.PARENT_UNABLE_TO_BE_SET);
	}
	if (this._parent && this._parent != parent) {
		this._parent.removeChild(this);
	}
	this._parent = parent;
	this.setParentEventTarget(parent);
}

/**
 * get graphics group, creating it if needed
 * 
 * @type{goog.graphics.GroupElement}
 */
jchemhub.view.Drawing.prototype.getGroup = function() {
	if (!this._group) {
		var group = this.getGraphics().createGroup();
		this._group = group;
		this._group.drawing = this;
		this._group.setParentEventTarget(this);
//		this.handler.listen(group, [ goog.events.EventType.MOUSEOVER, group,
//				goog.events.EventType.MOUSEOUT, goog.events.EventType.CLICK,
//				goog.events.EventType.MOUSEDOWN ], this._bubble);
	}
	return this._group;
};

jchemhub.view.Drawing.prototype._bubble = function(e) {
	this.dispatchEvent(e);
}

/**
 * get config from parent
 * 
 */
jchemhub.view.Drawing.prototype.getConfig = function() {
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
jchemhub.view.Drawing.prototype.getTransform = function() {
	return this._transform;
};

/**
 * set transform
 * 
 * @param transform
 *            {goog.graphics.AffineTransform}
 */
jchemhub.view.Drawing.prototype.setTransform = function(transform) {
	this._transform = transform;
	goog.array.forEach(this.getChildren(), function(child) {
		child.setTransform(transform);
	}, this);
};


jchemhub.view.Drawing.prototype.clear = function() {
	this.getGroup().clear();
	goog.array.forEach(this.getChildren(), function(child) {
		child.clear();
	}, this);
}

/**
 * TTD: this probably should be an extension of AffileTransform transform array
 * of coordinates
 * 
 * @param trans
 *            {goog.graphics.AffineTransform}
 * @param source_coords{!Array.
 *            <goog.math.Coordinate>}
 * @return {!Array.<goog.math.Coordinate>}
 */
jchemhub.view.Drawing.prototype.transformCoords = function(trans, source_coords) {
	var pairs = goog.array.map(source_coords, function(coord) {
		return [ coord.x, coord.y ];
	});
	var source_points = goog.array.flatten(pairs);
	var dest_points = [];
	trans.transform(source_points, 0, dest_points, 0, source_points.length / 2)

	var dest_coords = [];
	for ( var i = 0; i < dest_points.length; i += 2) {
		dest_coords.push(new goog.math.Coordinate(dest_points[i],
				dest_points[i + 1]));
	}
	;
	return dest_coords;
};

jchemhub.view.Drawing.prototype.toggleHighlight = function() {
	var config = this.getConfig();
	var strokeWidth = config.get("bond").stroke.width * 3;
	var color = config.get("highlight").color;
	var stroke = new goog.graphics.Stroke(strokeWidth, color);
	goog.array.forEach(this._elements, function(el) {
		if (!el.isHighlight) {
			el.isHighlight = true;
			el.oldStroke = el.getStroke();
			el.setStroke(stroke);
		} else {
			el.isHighlight = false;
			el.setStroke(el.oldStroke);
		}
	}, this);
}

/**
 * Errors thrown by the drawing.
 * 
 * @enum {string}
 */
jchemhub.view.Drawing.Error = {

	/**
	 * Error when an attempt is made to set the parent of a drawing in a way
	 * that would result in an inconsistent object graph.
	 */
	PARENT_UNABLE_TO_BE_SET : 'Unable to set parent component'
};

/** @inheritDoc */
jchemhub.view.Drawing.prototype.disposeInternal = function() {
	jchemhub.view.Drawing.superClass_.disposeInternal.call(this);
	this.handler.dispose();
}
