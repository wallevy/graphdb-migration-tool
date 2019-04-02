import * as async from 'async';
import * as fs from 'fs-extra';
import { stdout as log } from 'single-line-log';
import { GremlinConnector } from '../connectors/gremlin-connector';
import { SQLConnnector } from '../connectors/sql-connector';
import graphSchema from '../schema/graph-schema';
import { Transformer } from '../transformer/transformer';

export function sqlToGraphCmd(
  sqlConfigFile: string,
  query: string,
  templateFile: string,
  graphConfigFile: string
) {
  const sqlConfig = fs.readJSONSync(sqlConfigFile);
  const template = fs.readFileSync(templateFile, { encoding: 'utf-8' });
  const graphConfig: any = fs.readJSONSync(graphConfigFile);
  sqlToGraph(sqlConfig, query, template, graphConfig, err => {
    if (err) {
      console.log(err.message);
    }
  });
}

export function sqlToGraph(
  sqlConfig: any,
  query: string,
  template: string,
  graphConfig: any,
  callback?: (err: any) => void
) {
  const sqlConnector = new SQLConnnector(sqlConfig);
  const graphConnector = new GremlinConnector(graphConfig);

  async.waterfall(
    [
      (cb: any) => {
        console.log('Start querying from database');
        console.log(new Date().toString());
        sqlConnector.queryDatabase(query, cb);
      },
      (rowCount: number, rows: any[], cb: any) => {
        const transformer = new Transformer({});
        console.log('Start transforming and migrating');
        console.log(new Date().toString());

        async.eachOfLimit(
          rows,
          graphConfig.batchSize,
          (row, num, callBack) => {
            const result = transformer.transformJSON(
              template,
              row,
              graphSchema
            );
            graphConnector.createGraph(result, callBack);
            log(`Progress: ${++(num as number)}/${rows.length}\n`);
          },
          err => {
            if (err) {
              cb(err);
            } else {
              cb(new Date().toString());
            }
          }
        );
      },
    ],
    err => {
      sqlConnector.closeConnection();
      graphConnector.closeConnection();
      if (callback) {
        callback(err);
      }
    }
  );
}
