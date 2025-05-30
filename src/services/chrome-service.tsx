import { Holding } from "../types/holding";
import InjectionResult = chrome.scripting.InjectionResult;

export const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

export const executeScriptInTab = async (
  tabId: number,
  func: (data: Holding[]) => void,
  data: Holding[],
): Promise<InjectionResult<void>[]> => {
  return chrome.scripting.executeScript({
    target: { tabId },
    func,
    args: [data],
  });
};
