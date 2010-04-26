/**
 * @fileoverview Main Renderer Class
 *
 */
goog.provide('jchemhub.render.Renderer');
goog.require('jchemhub.ring.RingFinder');
goog.require('jchemhub.resource.Covalence');

jchemhub.render.Renderer = function(context){
    this.context = context;
    context.mol.renderer = this;
    context.renderParams.atomFont.size = 18 * context.renderParams.zoomFactor;
    context.renderParams.atomSubFont.size = 14 * context.renderParams.zoomFactor; 
    this.transform = jchemhub.render.Geometry.createTransform(context);
    this.graphics = goog.graphics.createGraphics(context.width, context.height);
    this.graphics.render(context.targetElement);
    this.mouseFocusEvents = [goog.events.EventType.MOUSEOVER, goog.events.EventType.MOUSEOUT]
	this.graphics.drawRect(0,0,context.width, context.height,null,context.renderParams.backgroundFill);
  	this.renderBonds();
   	this.renderAtoms();
};


jchemhub.render.Renderer.prototype.renderBonds = function(){
	var context=this.context;
	var transform=this.transform;
	var graphics=this.graphics;

    var all_rings=jchemhub.ring.RingFinder.findRings(context.mol);

    for (var i = 0, il = context.mol.countBonds(); i < il; i++) {
        var bond = context.mol.getBond(i);
        var ptSource = transform.transformPoint(bond.source.x, bond.source.y);
        var ptTarget = transform.transformPoint(bond.target.x, bond.target.y);
        
        var bondPath = new goog.graphics.Path();
        var bondStroke =context.renderParams.bondStroke;
        var bondFill = null;
        var result = jchemhub.render.Geometry.distanceCalculator(bond, context.renderParams.bondDistance / transform.getScaleX())
        var ptLine0_source = transform.transformPoint(result.source[0].x, result.source[0].y);
        var ptLine0_target = transform.transformPoint(result.target[0].x, result.target[0].y);
        var ptLine1_source = transform.transformPoint(result.source[1].x, result.source[1].y);
        var ptLine1_target = transform.transformPoint(result.target[1].x, result.target[1].y);
        
        switch (bond.bondType) {
			case jchemhub.model.Bond.BondType.Single:
				switch (bond.stereoType) {
					case jchemhub.model.Bond.StereoType.Single.NotStereo:
						bondPath.moveTo(ptSource.x, ptSource.y);
						bondPath.lineTo(ptTarget.x, ptTarget.y);
						break;
					case jchemhub.model.Bond.StereoType.Single.Up:
						bondPath.moveTo(ptSource.x, ptSource.y);
						bondPath.lineTo(ptLine0_target.x, ptLine0_target.y);
						bondPath.lineTo(ptLine1_target.x, ptLine1_target.y);
						bondStroke = context.renderParams.upBondStroke;
						bondFill = context.renderParams.upBondFill;
						break;
					case jchemhub.model.Bond.StereoType.Single.Down:
                        for(var j=0,lines=10;j<lines;j++){
                            bondPath.moveTo(ptSource.x*(1-j/lines)+ptLine0_target.x*j/lines, ptSource.y*(1-j/lines)+ptLine0_target.y*j/lines);
                            bondPath.lineTo(ptSource.x*(1-j/lines)+ptLine1_target.x*j/lines, ptSource.y*(1-j/lines)+ptLine1_target.y*j/lines);
                        }
                        bondStroke = context.renderParams.downBondStroke;
                        bondFill = context.renderParams.downBondFill;
						break;
					case jchemhub.model.Bond.StereoType.Single.Either:
                        bondPath.moveTo(ptSource.x, ptSource.y);                            
                        for(var j=0,lines=10;j<lines;j++){
                            if(j%2){
                                bondPath.lineTo(ptSource.x*(1-j/lines)+ptLine0_target.x*j/lines, ptSource.y*(1-j/lines)+ptLine0_target.y*j/lines);
                            }else{
                                bondPath.lineTo(ptSource.x*(1-j/lines)+ptLine1_target.x*j/lines, ptSource.y*(1-j/lines)+ptLine1_target.y*j/lines);
                            }
                        }
                        bondStroke = context.renderParams.upOrDownBondStroke;
                        bondFill = context.renderParams.upOrDownBondFill;
						break;
				}
				break;
			case jchemhub.model.Bond.BondType.Double:
				var inRing = false;
				var ring=null;
                    //TODO remove this step by assigning rings to atom in ring finder
				for (var r = 0, rl = all_rings.length; r < rl; r++) {
					ring = all_rings[r];
					if (goog.array.contains(ring.bonds, bond)) {
						inRing = true;
						break;
					}
				}
				if (!inRing) {
                    bondPath.moveTo(ptLine0_source.x, ptLine0_source.y);
                    bondPath.lineTo(ptLine0_target.x, ptLine0_target.y);
                    bondPath.moveTo(ptLine1_source.x, ptLine1_source.y);
                    bondPath.lineTo(ptLine1_target.x, ptLine1_target.y);
                    break;
				}
				else {
					// draw inner line element in the case of a double bond in a ring
                    bondPath.moveTo(ptSource.x, ptSource.y);
                    bondPath.lineTo(ptTarget.x, ptTarget.y);
					var ringCenter= transform.transformPoint(ring.ringCenter[0], ring.ringCenter[1]);
					var innerLineFromCoords=jchemhub.render.Geometry.interpolate(ptSource.x, ptSource.y,ringCenter.x,ringCenter.y,0.20);
                    var innerLineToCoords  =jchemhub.render.Geometry.interpolate(ptTarget.x, ptTarget.y,ringCenter.x,ringCenter.y,0.20);
                    bondPath.moveTo(innerLineFromCoords[0],innerLineFromCoords[1]);
                    bondPath.lineTo(innerLineToCoords[0],innerLineToCoords[1]);
                    break;
				}
            case jchemhub.model.Bond.BondType.Triple:
                bondPath.moveTo(ptSource.x, ptSource.y);
                bondPath.lineTo(ptTarget.x, ptTarget.y);
                bondPath.moveTo(ptLine0_source.x, ptLine0_source.y);
                bondPath.lineTo(ptLine0_target.x, ptLine0_target.y);
                bondPath.moveTo(ptLine1_source.x, ptLine1_source.y);
                bondPath.lineTo(ptLine1_target.x, ptLine1_target.y);
                break;
            case jchemhub.model.Bond.BondType.Aromatic:
                break;
        }
        
        var group = graphics.createGroup();
        
		result = jchemhub.render.Geometry.distanceCalculator(bond, context.renderParams.atomTransparentCircleSize/transform.getScaleX())
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
                    var bondAngle = jchemhub.render.Geometry.getBondAngle(bond);
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

jchemhub.render.Renderer.prototype.renderAtoms = function(){
	var context=this.context;
	var transform=this.transform;
	var graphics=this.graphics; //Have to keep this, don't know why. Otherwise graphics is not accessable;

    for (var i = 0, il = context.mol.countAtoms(); i < il; i++) {
        var atom = context.mol.getAtom(i);
        var point = transform.transformPoint(atom.x,atom.y);
        
		var symbol = atom.symbol;
        
        var shouldDrawAtom = false;
        if(symbol=="C"){
            if(context.renderParams.drawEndCarbon&&atom.countBonds()==1){
                shouldDrawAtom=true;
            }else if(atom.charge!=0){
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

			var atomLabelFill = context.renderParams.atomLabelFill[symbol]?context.renderParams.atomLabelFill[symbol]:context.renderParams.atomLabelFill['C'];
            var atomLabelBackgroundFill = context.renderParams.backgroundFill;
            var mainAtomLabel=symbol,subscriptLabel=null,superscriptLabel=null;
            if (shouldDrawAtom) {
                if (context.renderParams.showImplicitHydrogens) {
                    var cov = jchemhub.resource.Covalence[symbol];
                    if (cov) {
                        var totalBondOrder=0;
                        goog.array.forEach(atom.bonds.getValues(),function(element,index,array){
                            totalBondOrder+=element.bondType;//TODO not good enough, need to handle aromatic bonds.        
                        });
                        var hydrogenCount = cov-totalBondOrder-Math.abs(atom.charge);
                        if(hydrogenCount>0){
                            mainAtomLabel=symbol+"H";
                            if(hydrogenCount>1){
                                subscriptLabel=hydrogenCount+'';
                            }
                        }
                    }
                    if(atom.charge!=0){
                        if(atom.charge==1){
                            superscriptLabel='+';
                        }else if(atom.charge>1){
                            superscriptLabel=atom.charge+'+';
                        }else if(atom.charge==-1){
                            superscriptLabel='-';
                        }else if(atom.charge<-1){
                            superscriptLabel=(-atom.charge)+'-';
                        }
                    }
                }
                var textWidth = jchemhub.render.Renderer.getTextWidth(mainAtomLabel, context.renderParams.atomFont);
                var textHeight = context.renderParams.atomFont.size;
                group.atomLabelBackgroud = graphics.drawRect(point.x - textWidth / 2, point.y - textHeight / 2, textWidth, textHeight, null, atomLabelBackgroundFill, group);                
                graphics.drawText(mainAtomLabel, point.x - textWidth / 2, point.y - textHeight / 2, textWidth, textHeight, 'center', null, context.renderParams.atomFont, context.renderParams.atomLabelStroke, atomLabelFill, group);
                if(subscriptLabel||superscriptLabel){
                    var subSize = context.renderParams.atomSubFont.size;
                    if(subscriptLabel){
                    graphics.drawText(subscriptLabel, point.x + textWidth / 3, point.y , subSize, subSize, 'center', null, context.renderParams.atomSubFont, context.renderParams.atomLabelStroke, atomLabelFill, group);
                }
                if(superscriptLabel){
                    graphics.drawText(superscriptLabel, point.x + textWidth *0.4, point.y-textHeight*0.8 , subSize, subSize, 'center', null, context.renderParams.atomSubFont, context.renderParams.atomLabelStroke, atomLabelFill, group);
                }
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

jchemhub.render.Renderer.getTextWidth = function(text, font){
    //TODO measure text width with div
    return text.length * 0.55 * font.size;
};


jchemhub.render.Renderer.prototype.refresh = function(){

};
