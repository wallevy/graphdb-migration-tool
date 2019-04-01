import * as Ajv from "ajv";
import * as handlebars from "handlebars";
import * as jsonlint from "jsonlint";
import * as uuid from "uuid";
import { GraphInfo } from "../models/graph-model";
import { ajvErrorLint } from "../utils/ajvErrorLint";

export class Transformer {
  private validator: Ajv.Ajv;

  constructor(config: any) {
    this.registerHelpers();
    this.validator = new Ajv({ jsonPointers: true });
  }

  public parseTemplate(template: string, data: object): string {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  }

  public transformJSON(
    template: string,
    doc: object,
    validationSchema?: object
  ): GraphInfo {
    const transformedDoc = this.parseTemplate(template, doc);
    const result: GraphInfo = jsonlint.parse(transformedDoc);
    if (validationSchema) {
      this.validateJSON(result, validationSchema);
    }
    return result;
  }

  public validateJSON(json: any, schema: object) {
    const valid = this.validator.validate(schema, json);
    if (!valid) {
      const output = ajvErrorLint(
        json,
        this.validator.errors![0] as Ajv.ErrorObject,
        this.validator.errorsText()
      );
      throw new Error("Schema validation error: \n" + output);
    }
    return valid;
  }

  private registerHelpers(): void {
    handlebars.registerHelper("$guid", () => uuid.v4());
  }
}
