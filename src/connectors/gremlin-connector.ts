import * as async from 'async';
import * as Gremlin from 'gremlin';
import * as GraphHelper from '../gremlin-helpers/graphHelper';
import { Edge, GraphInfo, Vertex } from '../models/graph-model';

export class GremlinConnector {
  private client: Gremlin.GremlinClient;
  private batchSize: number;
  private defaultBatchSize = 10;

  constructor(config: any) {
    this.client = Gremlin.createClient(config.port, config.host, {
      password: config.password,
      session: false,
      ssl: true,
      user: config.user,
    });
    this.batchSize = config.batchSize
      ? config.batchSize
      : this.defaultBatchSize;
  }

  public createGraph(graphInfo: GraphInfo, callback: any) {
    async.series(
      [
        (cb: any) => {
          this.addVertices(graphInfo.vertices, cb);
        },
        (cb: any) => {
          this.addEdges(graphInfo.edges, cb);
        },
      ],
      err => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      }
    );
  }

  public addVertices(vertices: Vertex[], callback: any) {
    async.eachOfLimit(
      vertices,
      this.batchSize,
      (value, key, cb) => {
        const command = GraphHelper.getVertexQuery(value);
        this.client.execute(command, err => cb(err as any));
      },
      err => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      }
    );
  }

  public addEdges(edges: Edge[], callback: any) {
    async.eachOfLimit(
      edges,
      this.batchSize,
      (value, key, cb) => {
        const command = GraphHelper.getEdgeQuery(value);
        this.client.execute(command, err => cb(err as any));
      },
      err => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      }
    );
  }

  public closeConnection() {
    this.client.closeConnection();
  }
}
