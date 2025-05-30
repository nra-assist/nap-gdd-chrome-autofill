import { Holding } from "../types/holding";

export const parseJsonFile = async (file: File): Promise<Holding[]> => {
  const text = await file.text();
  return JSON.parse(text);
};
