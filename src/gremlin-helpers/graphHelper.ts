import { Edge, Vertex } from '../models/graph-model';

export function getVertexQuery(vertexObj: Vertex): string {
  let query = `g.addV('${vertexObj.label}')`;
  if (vertexObj.properties) {
    for (const key of Object.keys(vertexObj.properties)) {
      let value = vertexObj.properties[key];
      if (typeof value === 'string') {
        value = `'${value}'`;
      }
      query += `.property('${key}',${value})`;
    }
  }
  return query;
}

export function getEdgeQuery(edgeObj: Edge): string {
  let query =
    `g.V().has('id','${edgeObj.from}').addE('${edgeObj.label}')` +
    `.to(g.V().has('id','${edgeObj.to}'))`;
  if (edgeObj.properties) {
    for (const key of Object.keys(edgeObj.properties)) {
      let value = edgeObj.properties[key];
      if (typeof value === 'string') {
        value = `'${value}'`;
      }
      query += `.property('${key}',${value})`;
    }
  }
  return query;
}

export function removeDuplicateVertexes(vertexes: Vertex[]) {
  const seen: { [key: string]: boolean } = {};
  return vertexes.filter(vertex => {
    return seen.hasOwnProperty(vertex.properties.id)
      ? false
      : (seen[vertex.properties.id] = true);
  });
}

export function removeDuplicateEdges(edges: Edge[]) {
  const seen: { [key: string]: boolean } = {};
  return edges.filter(edge => {
    const edgeId = `${edge.label}-${edge.from}-${edge.to}`;
    return seen.hasOwnProperty(edgeId) ? false : (seen[edgeId] = true);
  });
}
