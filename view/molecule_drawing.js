goog.provide("jchemhub.view.MoleculeDrawing");
goog.require("jchemhub.view.AtomDrawing");
goog.require("jchemhub.view.SingleBondDownDrawing");
goog.require("jchemhub.view.SingleBondDrawing");
goog.require("jchemhub.view.SingleBondUpDrawing");
goog.require("jchemhub.view.SingleBondEitherDrawing");
goog.require("jchemhub.view.DoubleBondDrawing");
goog.require("jchemhub.view.TripleBondDrawing");
goog.require("goog.math.Box");

/**
 * A molecule graphical element in the reaction editor.
 * 
 * @param {jchemhub.view.Drawing}
 *            parent Drawing object
 * 
 * @constructor
 * @extends {jchemhub.view.Drawing}
 */
jchemhub.view.MoleculeDrawing = function(name) {
	jchemhub.view.Drawing.call(this);
	this._name = name;
	// this.addEventListener(goog.events.EventType.CLICK, this.toggleHighlight);
	this.addEventListener(goog.events.EventType.MOUSEDOWN, this.drag);

};
goog.inherits(jchemhub.view.MoleculeDrawing, jchemhub.view.Drawing);

/**
 * @override
 * does not call children's layout function, just sets their transform
 */
jchemhub.view.MoleculeDrawing.prototype.layoutChildren = function() {
	goog.array.forEach(this.getChildren(), function(child) {
		child.setTransform(this.getTransform());
	}, this);
};

/**
 * render this drawing and all its children
 */
jchemhub.view.MoleculeDrawing.prototype.render = function() {
	this.renderChildren();
};

jchemhub.view.MoleculeDrawing.prototype.toggleHighlight = function(e) {
	if (!this.isSelected) {
		this.isSelected = true;
	} else {
		this.isSelected = false;
	}
	goog.array.forEach(this.getChildren(), function(child) {
		child.toggleHighlight();
	});
};

jchemhub.view.MoleculeDrawing.prototype.drag = function(e) {
	var mol = e.currentTarget;
	var d = new goog.fx.Dragger(mol.getGroup().getElement());
	d._prevX = e.clientX;
	d._prevY = e.clientY;
	d._startX = e.clientX;
	d._startY = e.clientY;

	d.molecule = mol;
	d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {

		goog.array.forEach(d.molecule.getChildren(), function(child) {
			var trans = child.getGroup().getTransform();
			var newX = e.clientX - d._prevX + trans.getTranslateX();
			var newY = e.clientY - d._prevY + trans.getTranslateY();
			child.getGroup().setTransformation(newX, newY, 0, 0, 0);
		});

		d._prevX = e.clientX;
		d._prevY = e.clientY;

	});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
		var base_trans = d.molecule.getTransform();
		var trans = new goog.graphics.AffineTransform.getTranslateInstance(
				e.clientX - d._startX, e.clientY - d._startY);

		d.molecule.transformDrawing(trans);
		d.molecule.clear();
		d.molecule.render();
		d.dispose();
	});
	d.startDrag(e);
};
