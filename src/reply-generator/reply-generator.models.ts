export type QueryResponse = {
  reply: string;
  intent: string;
  confidence: number;
};

export type IntentApiResponse = Array<{
  name: string;
  confidence: number;
}>;
