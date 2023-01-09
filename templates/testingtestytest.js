// Node in the tree view
class Node {
    constructor(id, name, parents, children) {
      this.id = id;
      this.name = name;
      this.parents = parents;
      this.children = children;
    }
}

let graph = new Map()

// First for each package get their name and make a node. (We'll miss the root node, so we'll need to do that as well later.)
if(SBOM.packages.length > 0){
  SBOM.packages.forEach((p) => {
          if (graph.get(p.SPDXID) === undefined){
                  graph.set(p.SPDXID, new Node(p.SPDXID, p.name, [], []));
          }
  })

  // Now we iterate over all the relationships and ensure that each node has the appropriate parent and children.
  SBOM.relationships.forEach((rel) => {
  if (rel.relationshipType === "CONTAINS") {
          if (graph.get(rel.spdxElementId) === undefined){
                  graph.set(rel.spdxElementId, new Node(rel.spdxElementId, "Your Project", [], []));
          }
          if (graph.get(rel.relatedSpdxElement) === undefined){
                  graph.set(rel.relatedSpdxElement, new Node(rel.relatedSpdxElement,"", [], []));
          }
          let newParent = graph.get(rel.spdxElementId)
          newParent.children.push(rel.relatedSpdxElement)
          let newChild = graph.get(rel.relatedSpdxElement)
          newChild.parents.push(rel.spdxElementId)
          graph.set(
              rel.spdxElementId, newParent
          )
          graph.set(
              rel.relatedSpdxElement, newChild
          )
      }
  })


  // To begin our tree, we need to find the root. We pick the first node and ascend the parents until we find the root element.
  let rootelem = graph.keys().next().value;
  while (graph.get(rootelem).parents.length){
      rootelem = graph.get(rootelem).parents[0];
  }
}

if (SBOM.packages.length > 0) { include('SBOMItem', {"grapharr": Array.from(graph), parent: rootelem, lastItem : false}) }