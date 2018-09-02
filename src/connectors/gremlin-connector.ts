import * as async from 'async';
import * as convertHrtime from 'convert-hrtime';
import * as Gremlin from 'gremlin';
import { stdout as log } from 'single-line-log';
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
      err => callback(err)
    );
  }

  public addVertices(vertices: Vertex[], callback: any) {
    const timer = process.hrtime();
    async.eachOfLimit(
      vertices,
      this.batchSize,
      (value, key, cb) => {
        const command = GraphHelper.getVertexQuery(value);
        this.client.execute(command, (err, res) => {
          if (!err) {
            log(`Added vertices: ${(key as number) + 1}/${vertices.length}`);
          }
          cb(err as any);
        });
      },
      err => {
        if (err) {
          callback(err);
        } else {
          console.log('\nFinished adding vertices');
          const timeTaken = convertHrtime(process.hrtime(timer)).seconds;
          console.log(
            `Added ${vertices.length} vertices in ${timeTaken} seconds`
          );
          callback();
        }
      }
    );
  }

  public addEdges(edges: Edge[], callback: any) {
    const timer = process.hrtime();
    async.eachOfLimit(
      edges,
      this.batchSize,
      (value, key, cb) => {
        const command = GraphHelper.getEdgeQuery(value);
        this.client.execute(command, (err, res) => {
          if (!err) {
            log(`Adding edges: ${(key as number) + 1}/${edges.length}`);
          }
          cb(err as any);
        });
      },
      err => {
        if (err) {
          callback(err);
        } else {
          console.log('\nFinished adding edges');
          const timeTaken = convertHrtime(process.hrtime(timer)).seconds;
          console.log(`Added ${edges.length} edges in ${timeTaken} seconds`);
          callback();
        }
      }
    );
  }

  public closeConnection() {
    this.client.closeConnection();
  }
}
