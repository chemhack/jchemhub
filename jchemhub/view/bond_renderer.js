goog.provide('jchemhub.view.BondRenderer');
goog.provide('jchemhub.view.BondRenderer.Factory');
goog.require('jchemhub.view.SingleBondRenderer');
goog.require('jchemhub.view.DoubleBondRenderer');
goog.require('jchemhub.view.TripleBondRenderer');
goog.require('jchemhub.view.QuadrupleBondRenderer');
goog.require('jchemhub.view.SingleUpBondRenderer');
goog.require('jchemhub.view.SingleDownBondRenderer');
goog.require('jchemhub.view.SingleUpOrDownBondRenderer');
goog.require('jchemhub.view.Renderer');
goog.require('jchemhub.math.Line');

/**
 * Class to render a bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.BondRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.Renderer.call(this, controller, graphics, opt_config,
			jchemhub.view.BondRenderer.defaultConfig);
}
goog.inherits(jchemhub.view.BondRenderer, jchemhub.view.Renderer);
/**
 * renders the box surrounding the bond to serve as a click target
 * 
 * @param bond
 * @param transform
 * @return
 */
jchemhub.view.BondRenderer.prototype.render = function(bond, transform) {
	this.transform = transform;

	var fill = new goog.graphics.SolidFill('red', 0.001); // 'transparent'
	// fill
	var stroke = null;
	var radius = this.config.get("highlight").radius ;
	var theta = jchemhub.view.BondRenderer.getTheta(bond);

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var transleft = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* radius, Math.sin(angle_left) * radius);

	var transright = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* radius, Math.sin(angle_right) * radius);

	var leftside = transleft.transformCoords( [ bond.source.coord,
			bond.target.coord ]);
	var rightside = transright.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	var boxCoords = transform.transformCoords( [ leftside[0], leftside[1],
			rightside[0], rightside[1] ]);

	bondBoxPath = new goog.graphics.Path();
	bondBoxPath.moveTo(boxCoords[0].x, boxCoords[0].y);
	bondBoxPath.lineTo(boxCoords[2].x, boxCoords[2].y);
	bondBoxPath.lineTo(boxCoords[3].x, boxCoords[3].y);
	bondBoxPath.lineTo(boxCoords[1].x, boxCoords[1].y);
	bondBoxPath.close();

	var group = this.graphics.createGroup();
	this.graphics.drawPath(bondBoxPath, stroke, fill, group);
	group.addEventListener(goog.events.EventType.MOUSEOVER, goog.bind(
			this.controller.handleMouseOver, this.controller, bond));
	group.addEventListener(goog.events.EventType.MOUSEOUT, goog.bind(
			this.controller.handleMouseOut, this.controller, bond));
	group.addEventListener(goog.events.EventType.MOUSEDOWN, goog.bind(
			this.controller.handleMouseDown, this.controller, bond));

};

jchemhub.view.BondRenderer.prototype.highlightOn = function(bond, opt_group) {

	var strokeWidth = this.config.get("bond").stroke.width * 2;
	var stroke = new goog.graphics.Stroke(strokeWidth, this.config
			.get("highlight").color);
	var fill = null
	var radius = this.config.get("highlight").radius
			* this.transform.getScaleX();
	var theta = -jchemhub.view.BondRenderer.getTheta(bond) * 180 / Math.PI;
	console.log('theta: ' + theta);
	var angle = theta + 90;
	console.log('angle: ' + angle);
	

	var arcExtent;
	if (theta <= 0) {
		arcExtent = (bond.source.coord.y <= bond.target.coord.y) ? 180 : -180;
	} else {
		arcExtent = (bond.source.coord.y > bond.target.coord.y) ? 180 : -180;
	}

	var coords = this.transform.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	var path = new goog.graphics.Path();
	path.arc(coords[0].x, coords[0].y, radius, radius, angle, arcExtent);
	path.arc(coords[1].x, coords[1].y, radius, radius, angle, -arcExtent);

	if (!opt_group) {
		opt_group = this.graphics.createGroup();
	}
	this.graphics.drawPath(path, stroke, fill, opt_group);
	return opt_group;
}

/**
 * 
 * @return{number} bond angle of elevation
 */
jchemhub.view.BondRenderer.getTheta = function(bond) {
	return new jchemhub.math.Line(bond.source.coord, bond.target.coord)
			.getTheta();
}

/**
 * A default configuration for renderer
 */
jchemhub.view.BondRenderer.defaultConfig = {
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
		radius : .3,
		color : 'blue'
	}
};

/**
 * factory class for BondRenderers
 * 
 * @param graphics
 * @param opt_config
 * @return
 */
jchemhub.view.BondRenderer.Factory = function(controller, graphics, opt_config) {
	this.controller = controller;
	this.graphics = graphics;
	this.config = new goog.structs.Map();
	if (opt_config) {
		this.config.addAll(opt_config); // merge optional config
	}
}

jchemhub.view.BondRenderer.Factory.prototype.get = function(bond) {
	if (bond instanceof jchemhub.model.SingleBondUp) {
		if (!this.singleUpBondRenderer) {
			this.singleUpBondRenderer = new jchemhub.view.SingleUpBondRenderer(
					this.controller, this.graphics, this.config);
		}
		return this.singleUpBondRenderer;
	}
	if (bond instanceof jchemhub.model.SingleBondDown) {
		if (!this.singleDownBondRenderer) {
			this.singleDownBondRenderer = new jchemhub.view.SingleDownBondRenderer(
					this.controller, this.graphics, this.config);
		}
		return this.singleDownBondRenderer;
	}
	if (bond instanceof jchemhub.model.SingleBondUpOrDown) {
		if (!this.singleUpOrDownBondRenderer) {
			this.singleUpOrDownBondRenderer = new jchemhub.view.SingleUpOrDownBondRenderer(
					this.controller, this.graphics, this.config);
		}
		return this.singleUpOrDownBondRenderer;
	}
	if (bond instanceof jchemhub.model.SingleBond) {
		if (!this.singleBondRenderer) {
			this.singleBondRenderer = new jchemhub.view.SingleBondRenderer(
					this.controller, this.graphics, this.config);
		}
		return this.singleBondRenderer;
	}
	if (bond instanceof jchemhub.model.DoubleBond) {
		if (!this.doubleBondRenderer) {
			this.doubleBondRenderer = new jchemhub.view.DoubleBondRenderer(
					this.controller, this.graphics, this.config);
		}
		return this.doubleBondRenderer;
	}
	if (bond instanceof jchemhub.model.TripleBond) {
		if (!this.tripleBondRenderer) {
			this.tripleBondRenderer = new jchemhub.view.TripleBondRenderer(
					this.controller, this.graphics, this.config);
		}
		return this.tripleBondRenderer;
	}
	if (bond instanceof jchemhub.model.QuadrupleBond) {
		if (!this.quadrupleBondRenderer) {
			this.quadrupleBondRenderer = new jchemhub.view.QuadrupleBondRenderer(
					this.controller, this.graphics, this.config);
		}
		return this.quadrupleBondRenderer;
	}
};
