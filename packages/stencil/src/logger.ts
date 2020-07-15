/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const logger = (data: string) => {
  if (process.env.DEBUG) {
    // tslint:disable-next-line: no-console
    console.log(`\n${data}`);
  }
};
