import * as Sequelize from "sequelize";

export class SQLConnnector {
  private connection: Sequelize.Sequelize;
  constructor(config: any) {
    config.options = config.options || {};
    config.options.rowCollectionOnRequestCompletion = true;
    this.connection = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        dialect: config.dialect,
        dialectOptions: config.options,
        host: config.host,
        operatorsAliases: false,
        pool: {
          idle: 10000,
          max: 5,
          min: 0,
        },
      }
    );
  }

  public queryDatabase(query: string, callback: any): void {
    this.connection
      .query(query, { raw: false, type: Sequelize.QueryTypes.SELECT })
      .then(
        response => {
          callback(null, response.length, response);
        },
        error => {
          callback(error);
        }
      );
  }

  public closeConnection() {
    this.connection.close();
  }
}
