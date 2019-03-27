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
    const vertexId = vertex.properties.id;
    return seen.hasOwnProperty(vertexId) ? false : (seen[vertexId] = true);
  });
}

export function removeDuplicateEdges(edges: Edge[]) {
  const seen: { [key: string]: boolean } = {};
  return edges.filter(edge => {
    const id = edge.properties && edge.properties.id ? edge.properties.id : '';
    const edgeId = `${edge.label}-${id}-${edge.from}-${edge.to}`;
    return seen.hasOwnProperty(edgeId) ? false : (seen[edgeId] = true);
  });
}
