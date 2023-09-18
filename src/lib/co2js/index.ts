import {IImpactModelInterface} from '../interfaces';
import {co2} from '@tgwf/co2';
import {CONFIG} from '../../config';

const {MODEL_IDS} = CONFIG;
const {CO2JS} = MODEL_IDS;

export class Co2jsModel implements IImpactModelInterface {
  authParams: object | undefined = undefined;
  staticParams: object | undefined;
  name: string | undefined;
  time: string | unknown;
  factor = 1;
  model: any;

  authenticate(authParams: object): void {
    this.authParams = authParams;
  }

  async calculate(observations: object | object[] | undefined): Promise<any[]> {
    return observations as any[];
  }

  async configure(
    name: string,
    staticParams: object | undefined
  ): Promise<IImpactModelInterface> {
    this.staticParams = staticParams;
    this.name = name;
    if (staticParams !== undefined && 'type' in staticParams) {
      if (!['1byte', 'swd'].includes(staticParams.type as string)) {
        throw new Error(
          `Invalid co2js model: ${staticParams.type}. Must be one of 1byte or swd.`
        );
      }
      this.model = co2({model: staticParams.type});
    }
    return this;
  }

  modelIdentifier(): string {
    return CO2JS;
  }
}
