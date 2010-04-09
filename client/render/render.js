/**
 * @fileoverview Main Renderer Class
 *
 */
goog.provide('chem.render.Renderer');

chem.render.Renderer = function(context){
    this.context = context;
    context.mol.renderer = this;
    context.renderParams.atomFont.size = 18 * context.renderParams.zoomFactor;
    context.renderParams.atomSubFont.size = 14 * context.renderParams.zoomFactor; 
    this.transform = chem.render.Geometry.createTransform(context);
    this.graphics = goog.graphics.createGraphics(context.width, context.height);
    this.graphics.render(context.targetElement);
    this.mouseFocusEvents = [goog.events.EventType.MOUSEOVER, goog.events.EventType.MOUSEOUT]
	this.graphics.drawRect(0,0,context.width, context.height,null,context.renderParams.backgroundFill);
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
        var bondStroke =context.renderParams.bondStroke;
        var bondFill = null;
        var result = chem.render.Geometry.distanceCalculator(bond, context.renderParams.bondDistance / transform.getScaleX())
        var ptLine0_source = transform.transformPoint(result.source[0].x, result.source[0].y);
        var ptLine0_target = transform.transformPoint(result.target[0].x, result.target[0].y);
        var ptLine1_source = transform.transformPoint(result.source[1].x, result.source[1].y);
        var ptLine1_target = transform.transformPoint(result.target[1].x, result.target[1].y);
        
        switch (bond.bondType) {
            case chem.core.Bond.BondType.Single:
				switch(bond.stereoType){
					case chem.core.Bond.StereoType.Single.NotStereo:
               			bondPath.moveTo(ptSource.x, ptSource.y);
               			bondPath.lineTo(ptTarget.x, ptTarget.y);
						break;
					case chem.core.Bond.StereoType.Single.Up:
                        bondPath.moveTo(ptSource.x, ptSource.y);
                        bondPath.lineTo(ptLine0_target.x, ptLine0_target.y);
                        bondPath.lineTo(ptLine1_target.x, ptLine1_target.y);
//                        bondPath.moveTo(ptSource.x, ptSource.y);
                        bondStroke=context.renderParams.upBondStroke;
                        bondFill=context.renderParams.upBondFill;
                        break;
					case chem.core.Bond.StereoType.Single.Down:
						break;
					case chem.core.Bond.StereoType.Single.Either:
						break;
				}
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
        
		result = chem.render.Geometry.distanceCalculator(bond, context.renderParams.atomTransparentCircleSize/transform.getScaleX())
        ptLine0_source = transform.transformPoint(result.source[0].x, result.source[0].y);
        ptLine0_target = transform.transformPoint(result.target[0].x, result.target[0].y);
        ptLine1_source = transform.transformPoint(result.source[1].x, result.source[1].y);
        ptLine1_target = transform.transformPoint(result.target[1].x, result.target[1].y);

        bondBoxPath = new goog.graphics.Path();
        bondBoxPath.moveTo(ptLine0_source.x, ptLine0_source.y);
        bondBoxPath.lineTo(ptLine0_target.x, ptLine0_target.y);
        bondBoxPath.lineTo(ptLine1_target.x, ptLine1_target.y);
        bondBoxPath.lineTo(ptLine1_source.x, ptLine1_source.y);
        bondBoxPath.close();
        
        group.bondPath = graphics.drawPath(bondPath, bondStroke, bondFill, group);
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
        
        var shouldDrawAtom = false;
        if(symbol=="C"){
            if(context.renderParams.drawEndCarbon&&atom.countBonds()==1){
                shouldDrawAtom=true;
            }
        }else if(symbol=="H"){
            shouldDrawAtom=context.renderParams.showExplicitHydrogens;
        }
        else{
            shouldDrawAtom=true;
        }
        
        var group = graphics.createGroup();

        if (shouldDrawAtom) {

            //Extend the graphics group object.

//            var shouldDrawAtom=false;
			var atomLabelFill = context.renderParams.atomLabelFill[symbol]?context.renderParams.atomLabelFill[symbol]:context.renderParams.atomLabelFill['C'];
            var atomLabelBackgroundFill = context.renderParams.backgroundFill;
            var mainAtomLabel=symbol,subscriptLabel=null,superscriptLabel=null;
            if (shouldDrawAtom) {
                if (context.renderParams.showImplicitHydrogens) {
                    var cov = chem.resource.Covalence[symbol];
                    if (cov) {
                        var totalBondOrder=0;
                        goog.array.forEach(atom.bonds.getValues(),function(element,index,array){
                            totalBondOrder+=element.bondType;//TODO not good enough, need to handle aromatic bonds.        
                        });
                        //TODO consider charge in
                        var hydrogenCount = cov-totalBondOrder;
                        if(hydrogenCount>0){
                            mainAtomLabel=symbol+"H";
                            if(hydrogenCount>1){
                                subscriptLabel=hydrogenCount+'';
                            }
                        }
                    }
                }
                var textWidth = chem.render.Renderer.getTextWidth(mainAtomLabel, context.renderParams.atomFont);
                var textHeight = context.renderParams.atomFont.size;
                group.atomLabelBackgroud = graphics.drawRect(point.x - textWidth / 2, point.y - textHeight / 2, textWidth, textHeight, null, atomLabelBackgroundFill, group);                
                graphics.drawText(mainAtomLabel, point.x - textWidth / 2, point.y - textHeight / 2, textWidth, textHeight, 'center', null, context.renderParams.atomFont, context.renderParams.atomLabelStroke, atomLabelFill, group);
                if(subscriptLabel){
                    graphics.drawText(subscriptLabel, point.x + textWidth / 3, point.y , textWidth, textHeight, 'center', null, context.renderParams.atomSubFont, context.renderParams.atomLabelStroke, atomLabelFill, group);
                }

            }

        }
        if (context.widgetType == "editor") {
            group.highlightCircle = graphics.drawCircle(point.x, point.y, context.renderParams.atomTransparentCircleSize, null, context.renderParams.transparentFill, group);        
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
};

chem.render.Renderer.getTextWidth = function(text, font){
    return text.length * 0.55 * font.size;
};


chem.render.Renderer.prototype.refresh = function(){

};
