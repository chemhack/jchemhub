/**
 * @fileoverview Main Renderer Class
 *
 */
goog.provide('chem.render.Renderer');

chem.render.Renderer = function(context){
    this.context = context;
    context.mol.renderer = this;
    context.renderParams.atomFont.size = 18 * context.renderParams.zoomFactor;
    this.transform = chem.render.Geometry.createTransform(context);
    this.graphics = goog.graphics.createGraphics(context.width, context.height);
    this.graphics.render(context.targetElement);
    this.mouseFocusEvents = [goog.events.EventType.MOUSEOVER, goog.events.EventType.MOUSEOUT]
  	this.renderBonds();
   	this.renderAtoms();
};


chem.render.Renderer.prototype.renderBonds = function(){
	var context=this.context;
	var transform=this.transform;
	var graphics=this.graphics;
    for (var i = 0, il = context.mol.countBonds(); i < il; i++) {
        var bond = context.mol.getBond(i);
        var ptSource = transform.transformPoint(bond.source.x, bond.source.y);
        var ptTarget = transform.transformPoint(bond.target.x, bond.target.y);
        
        var bondPath = new goog.graphics.Path();
        
        var result = chem.render.Geometry.distanceCalculator(bond, context.renderParams.bondDistance / transform.getScaleX())
        var ptLine0_source = transform.transformPoint(result.source[0].x, result.source[0].y);
        var ptLine0_target = transform.transformPoint(result.target[0].x, result.target[0].y);
        var ptLine1_source = transform.transformPoint(result.source[1].x, result.source[1].y);
        var ptLine1_target = transform.transformPoint(result.target[1].x, result.target[1].y);
        
        switch (bond.bondType) {
            case chem.core.Bond.BondType.Single:
                bondPath.moveTo(ptSource.x, ptSource.y);
                bondPath.lineTo(ptTarget.x, ptTarget.y);
                break;
            case chem.core.Bond.BondType.Double:
                bondPath.moveTo(ptLine0_source.x, ptLine0_source.y);
                bondPath.lineTo(ptLine0_target.x, ptLine0_target.y);
                bondPath.moveTo(ptLine1_source.x, ptLine1_source.y);
                bondPath.lineTo(ptLine1_target.x, ptLine1_target.y);
                break;
            case chem.core.Bond.BondType.Triple:
                bondPath.moveTo(ptSource.x, ptSource.y);
                bondPath.lineTo(ptTarget.x, ptTarget.y);
                bondPath.moveTo(ptLine0_source.x, ptLine0_source.y);
                bondPath.lineTo(ptLine0_target.x, ptLine0_target.y);
                bondPath.moveTo(ptLine1_source.x, ptLine1_source.y);
                bondPath.lineTo(ptLine1_target.x, ptLine1_target.y);
                break;
        }
        bondPath.close();
        
        var group = graphics.createGroup();
        
        bondBoxPath = new goog.graphics.Path();
        bondBoxPath.moveTo(ptLine0_source.x, ptLine0_source.y);
        bondBoxPath.lineTo(ptLine0_target.x, ptLine0_target.y);
        bondBoxPath.lineTo(ptLine1_target.x, ptLine1_target.y);
        bondBoxPath.lineTo(ptLine1_source.x, ptLine1_source.y);
        bondBoxPath.close();
        
        group.bondPath = graphics.drawPath(bondPath, context.renderParams.bondStroke, null, group);
        group.bondBoxPath = graphics.drawPath(bondBoxPath, null, context.renderParams.transparentFill, group);
        group.bond = bond;
        if (context.widgetType == "editor") {
            //TODO move the anoymous function to a var to better performance
            goog.events.listen(group, this.mouseFocusEvents, function(e){
                if (e.type == goog.events.EventType.MOUSEOVER) {
                    var bond = e.currentTarget.bond;
                    var ptSourceAtom = transform.transformPoint(bond.source.x, bond.source.y);
                    var ptTargetAtom = transform.transformPoint(bond.target.x, bond.target.y);
                    path = new goog.graphics.Path();
                    var bondAngle = chem.render.Geometry.getBondAngle(bond);
                    var arcStartAngle = (Math.PI / 2 - bondAngle) / Math.PI * 180;
                    var arcExtent;
                    if (bondAngle <= 0) 
                        arcExtent = (ptSourceAtom.y <= ptTargetAtom.y) ? 180 : -180;
                    else 
                        arcExtent = (ptSourceAtom.y > ptTargetAtom.y) ? 180 : -180;
                    path.arc(ptSourceAtom.x, ptSourceAtom.y, context.renderParams.atomTransparentCircleSize, context.renderParams.atomTransparentCircleSize, arcStartAngle, arcExtent, false);
                    path.arc(ptTargetAtom.x, ptTargetAtom.y, context.renderParams.atomTransparentCircleSize, context.renderParams.atomTransparentCircleSize, arcStartAngle, -arcExtent, false);
                    if (!e.currentTarget.bondHightlightGroup) 
                        e.currentTarget.bondHightlightGroup = graphics.createGroup();
                    graphics.drawPath(path, context.renderParams.bondHighlightStroke, null, e.currentTarget.bondHightlightGroup);
                    
                    //e.currentTarget.bondPath.setStroke(renderParams.bondHighlightStroke);
                }
                else 
                    if (e.type == goog.events.EventType.MOUSEOUT) {
                        //e.currentTarget.bondPath.setStroke(renderParams.bondStroke);
                        if (e.currentTarget.bondHightlightGroup) {
                            e.currentTarget.bondHightlightGroup.clear();
                        }
                    }
            });
        }
        
    }

};

chem.render.Renderer.prototype.renderAtoms = function(){
	var context=this.context;
	var transform=this.transform;
	var graphics=this.graphics; //Have to keep this, don't know why. Otherwise graphics is not accessable;

    for (var i = 0, il = context.mol.countAtoms(); i < il; i++) {
        var atom = context.mol.getAtom(i);
        var point = transform.transformPoint(atom.x, atom.y);
        var symbol = atom.symbol;
        
        var shouldDraw = (symbol != "H") || (context.renderParams.showExplicitHydrogens);
        
        if (shouldDraw) {
            var group = graphics.createGroup();
            
            var textWidth = chem.render.Renderer.getTextWidth(symbol, context.renderParams.atomFont);
            var textHeight = renderParams.atomFont.size;
            
            //Extend the graphics group object.
            group.highlightCircle = graphics.drawCircle(point.x, point.y, context.renderParams.atomTransparentCircleSize, null, context.renderParams.transparentFill, group);
            
            var shouldDrawAtom = symbol != "C";
            var atomLabelFill = context.renderParams.atomLabelFill;
            var atomLabelBackgroundFill = context.renderParams.backgroundFill;
            if (shouldDrawAtom) {
                group.atomLabelBackgroud = graphics.drawRect(point.x - textWidth / 2, point.y - textHeight / 2, textWidth, textHeight, null, atomLabelBackgroundFill, group);
                group.atomLabel = graphics.drawText(symbol, point.x - textWidth / 2, point.y - textHeight / 2, textWidth, textHeight, 'center', null, context.renderParams.atomFont, context.renderParams.atomLabelStroke, atomLabelFill, group);
            }
            
            if (context.widgetType == "editor") {
                goog.events.listen(group, this.mouseFocusEvents, function(e){
                    if (e.type == goog.events.EventType.MOUSEOVER) {
                        e.currentTarget.highlightCircle.setStroke(context.renderParams.atomHighlightStroke);
                    }
                    else 
                        if (e.type == goog.events.EventType.MOUSEOUT) {
                            e.currentTarget.highlightCircle.setStroke(null);
                        }
                });
            }
        }
        
    }
};

chem.render.Renderer.getTextWidth = function(text, font){
    return text.length * 0.55 * font.size;
};


chem.render.Renderer.prototype.refresh = function(){

};
