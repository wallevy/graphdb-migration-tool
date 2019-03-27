import { removeDuplicateEdges } from '../../src/gremlin-helpers/graphHelper';
import { Edge } from '../../src/models/graph-model';

describe('Given graphHelper is initialised', () => {
  it('when removeDuplicateEdges is called it should remove duplicated edges', () => {
    const edges: Edge[] = [
      {
        label: 'label1',
        from: 'from1',
        to: 'to1',
        properties: { id: 'id1', name: 'name1' },
      },
      {
        label: 'label1',
        from: 'from1',
        to: 'to1',
        properties: { id: 'id1', name: 'name2' },
      },
      {
        label: 'label3',
        from: 'from1',
        to: 'to1',
        properties: { id: 'id1', name: 'name1' },
      },
    ];

    const results = removeDuplicateEdges(edges);
    expect(results.length).toBe(2);
    expect(results[0].label).toEqual('label1');
    expect(results[1].label).toEqual('label3');
  });
});
