import { NocularResponse } from '../types/nocular.ts';

class HTTPError extends Error {
  response: NocularResponse;

  constructor(message: string, res: NocularResponse) {
    super(message);

    this.response = res;
  }
}

export default HTTPError;
