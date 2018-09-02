export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Edge: {
      properties: {
        from: {
          type: 'string',
        },
        label: {
          type: 'string',
        },
        properties: {
          additionalProperties: {},
          properties: {
            id: {
              type: 'string',
            },
          },
          type: 'object',
        },
        to: {
          type: 'string',
        },
      },
      required: ['from', 'label', 'to'],
      type: 'object',
    },
    Vertex: {
      properties: {
        label: {
          type: 'string',
        },
        properties: {
          additionalProperties: {},
          properties: {
            id: {
              type: 'string',
            },
          },
          required: ['id'],
          type: 'object',
        },
        type: {
          enum: ['vertex'],
          type: 'string',
        },
      },
      required: ['label'],
      type: 'object',
    },
  },
  properties: {
    edges: {
      items: {
        $ref: '#/definitions/Edge',
      },
      type: 'array',
    },
    vertices: {
      items: {
        $ref: '#/definitions/Vertex',
      },
      type: 'array',
    },
  },
  type: 'object',
};
