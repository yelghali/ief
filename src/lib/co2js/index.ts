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
  model: any | undefined;

  authenticate(authParams: object): void {
    this.authParams = authParams;
  }

  async calculate(observations: object | object[] | undefined): Promise<any[]> {
    if (observations === undefined) {
      throw new Error('Required Parameters not provided');
    }

    if (!Array.isArray(observations)) {
      throw new Error('observations must be an array');
    }
    return observations.map((observation: any) => {
      this.configure(this.name!, observation);
      if (this.model === undefined) {
        throw new Error('Model not configured');
      }
      if (observation['bytes'] === undefined) {
        throw new Error('bytes not provided');
      }
      let greenhosting = false;
      if (observation['greenhosting'] !== undefined) {
        greenhosting = observation['greenhosting'];
      }
      this.model.perByte(observation['bytes'], greenhosting);
      return observation;
    }) as any[];
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
