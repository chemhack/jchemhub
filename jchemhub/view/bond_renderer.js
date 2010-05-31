goog.provide('jchemhub.view.BondRenderer');
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
 * @param {jchemhub.model.Bond} bond
 * @param {jchemhub.graphics.AffineTransform} transform
 * @return {goog.graphics.GroupElement}
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
	
	return group;

};

jchemhub.view.BondRenderer.prototype.highlightOn = function(bond, opt_group) {

	var strokeWidth = this.config.get("bond").stroke.width * 2;
	var stroke = new goog.graphics.Stroke(strokeWidth, this.config
			.get("highlight").color);
	var fill = null
	var radius = this.config.get("highlight").radius
			* this.transform.getScaleX();
	var theta = -jchemhub.view.BondRenderer.getTheta(bond) * 180 / Math.PI;
	var angle = theta + 90;

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

