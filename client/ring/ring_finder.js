/*
 * Licence TODO
 *
 * Copyright (c) 2010 Mark Rijnbeek (markr@ebi.ac.uk)
 *
 * Ring finder classes, a JavaScript->Java conversion using
 * the MX Hanser ring finder classes.
 * For MX Java source see:
 * http://github.com/rapodaca/mx/tree/master/src/com/metamolecular/mx/ring/
 * http://metamolecular.com/mx
 */
goog.provide('chem.ring.RingFinder');
goog.require('goog.structs.Set');
goog.require('goog.array');

/**
 * Hansen ring finder.
 *
 * For details see:
 * Th. Hanser, Ph. Jauffret, and G. Kaufmann
 * A New Algorithm for Exhaustive Ring Perception in a Molecular Graph
 * J. Chem. Inf. Comput. Sci. 1996, 36, 1146-1152
 */
//_____________________________________________________________________________
// RingFinder
//_____________________________________________________________________________
chem.ring.RingFinder = function(){
}

chem.ring.RingFinder.findRings = function(_molecule){

    var molecule = _molecule;
    var rings = new Array();
    var cntAtom = molecule.countAtoms();
    
    graph = new chem.ring.PathGraph(molecule)
    
    for (var i = 0; i < molecule.countAtoms(); i++) {
        var edges = graph.remove(molecule.getAtom(i));
        for (var j = 0; j < edges.length; j++) {
            edge = edges[j];
            ring = edge.atoms;
            
            // xtra: last atom is same as first atom, remove it..
            goog.array.removeAt(ring, ring.length - 1);
            rings.push(ring);
        }
    }
    //xtra: sort array according to ring size
    goog.array.sort(rings);
    return rings;
}

//_____________________________________________________________________________
// PathGraph
//_____________________________________________________________________________

chem.ring.PathGraph = function(molecule){
    this.edges = new Array();
    this.atoms = new Array();
    // load edges
    for (var i = 0; i < molecule.countBonds(); i++) {
        bond = molecule.getBond(i);
        var edge = [bond.source, bond.target];
        this.edges.push(new chem.ring.PathEdge(edge));
    }
    // load atoms
    for (var i = 0; i < molecule.countAtoms(); i++) {
        this.atoms.push(molecule.getAtom(i));
    }
}

chem.ring.PathGraph.prototype.remove = function(atom){
    var oldEdges = this.getEdges(atom);
    result = new Array();
    for (var i = 0; i < oldEdges.length; i++) {
        if (oldEdges[i].isCycle()) {
            result.push(oldEdges[i]);
        }
    }
    
    for (var i = 0; i < result.length; i++) {
        if (goog.array.contains(oldEdges, result[i])) {
            goog.array.remove(oldEdges, result[i]);
        }
        if (goog.array.contains(this.edges, result[i])) {
            goog.array.remove(this.edges, result[i]);
        }
    }
    
    newEdges = this.spliceEdges(oldEdges);
    
    for (var i = 0; i < oldEdges.length; i++) {
        if (goog.array.contains(this.edges, oldEdges[i])) {
            goog.array.remove(this.edges, oldEdges[i]);
        }
    }
    
    for (var i = 0; i < newEdges.length; i++) {
        if (!goog.array.contains(this.edges, newEdges[i])) {
            this.edges.push(newEdges[i]);
        }
    }
    goog.array.remove(this.atoms, atom);
    return result;
}


chem.ring.PathGraph.prototype.getEdges = function(atom){
    var result = new Array();
    
    for (var i = 0; i < this.edges.length; i++) {
        edge = this.edges[i];
        
        if (edge.isCycle()) {
            if (goog.array.contains(edge.atoms, atom)) {
                result.push(edge);
            }
        }
        else {
            var lastAtomPos = edge.atoms.length - 1;
            if ((edge.atoms[0] == atom) || (edge.atoms[lastAtomPos] == atom)) {
                result.push(edge);
            }
        }
    }
    return result;
}

chem.ring.PathGraph.prototype.spliceEdges = function(_edges){
    var result = new Array();
    
    for (var i = 0; i < _edges.length; i++) {
        for (var j = i + 1; j < _edges.length; j++) {
            spliced = _edges[j].splice(_edges[i]);
            if (spliced != null) {
                result.push(spliced);
            }
        }
    }
    return result;
}



//_____________________________________________________________________________
// PathEdge
//_____________________________________________________________________________

chem.ring.PathEdge = function(_atoms){
    this.atoms = _atoms;
}

chem.ring.PathEdge.prototype.isCycle = function(){
    var lastAtomPos = this.atoms.length - 1;
    return (this.atoms.length > 2 && this.atoms[0] == this.atoms[lastAtomPos]);
}


chem.ring.PathEdge.prototype.splice = function(other){
    intersection = this.getIntersection(other.atoms);
    newAtoms = new Array();
    for (var i = 0; i < this.atoms.length; i++) {
        newAtoms.push(this.atoms[i]);
    }
    
    if (this.atoms[0] == intersection) {
        newAtoms.reverse();
    }
    
    if (other.atoms[0] == intersection) {
        for (var i = 1; i < other.atoms.length; i++) {
            newAtoms.push(other.atoms[i]);
        }
    }
    else {
        for (var i = other.atoms.length - 2; i >= 0; i--) {
            newAtoms.push(other.atoms[i]);
        }
    }
    
    if (!this.isRealPath(newAtoms)) {
        return null;
    }
    
    return new chem.ring.PathEdge(newAtoms);
}


chem.ring.PathEdge.prototype.isRealPath = function(atoms){
    for (var i = 1; i < atoms.length - 1; i++) {
        for (var j = 1; j < atoms.length - 1; j++) {
            if (i == j) {
                continue;
            }
            if (atoms[i] == atoms[j]) {
                return false;
            }
        }
    }
    return true;
}

chem.ring.PathEdge.prototype.getIntersection = function(others){
    var lastAtomPos = this.atoms.length - 1;
    var lastOtherPos = others.length - 1;
    if (this.atoms[lastAtomPos] == others[0] || this.atoms[lastAtomPos] == others[lastOtherPos]) {
        return this.atoms[lastAtomPos];
    }
    if (this.atoms[0] == others[0] || this.atoms[0] == others[lastOtherPos]) {
        return this.atoms[0];
    }
    throw "Couldn't splice - no intersection";
}
