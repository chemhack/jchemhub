goog.provide('jchemhub.model.Reaction');



/**
 * Creates a new Reaction.
 * @constructor
 */
jchemhub.model.Reaction=function()
{
    this.header="";
    this.reactants = new Array();
    this.products = new Array();
};
//TODO add docs
jchemhub.model.Reaction.prototype.addReactant=function(mol)
{
    this.reactants.push(mol);
};
jchemhub.model.Reaction.prototype.addProduct=function(mol)
{
    this.products.push(mol);
};