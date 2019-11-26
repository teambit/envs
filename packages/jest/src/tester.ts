export interface TestResult {
  title: string;
  fullTitle: string;
  duration: number | undefined;
  currentRetry: number;
  err: object;
}
