import { Result } from "../../types/result.tsx";
import { StockData } from "../../types/stock-data.tsx";

const fillApp6 = async (tabId: number, stockData: StockData): Promise<Result> => {
  const fillApp6Internal = (stockData: StockData): Result => {
    // HELPERS
    const updateInput = (name: string, value: string) => {
      const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (input) {
        input.value = value;
      }
    };

    const item = document.getElementById("part_1230")!;
    const anchor = item.querySelector("a")!;
    anchor.click();

    let totalSum = 0;
    if (stockData.interestsSum) {
      updateInput("dec50_app6_sum603", stockData.interestsSum);
      updateInput("dec50_app6_table2_income603", stockData.interestsSum);
      totalSum = totalSum + Number(stockData.interestsSum);
    }

    if (stockData.cashbacksSum) {
      updateInput("dec50_app6_sum606", stockData.cashbacksSum);
      updateInput("dec50_app6_table2_income606", stockData.cashbacksSum);
      totalSum = totalSum + Number(stockData.cashbacksSum);
    }

    updateInput("dec50_app6_row2", totalSum.toString());
    updateInput("dec50_app6_row5", totalSum.toString());

    const confirmButton = document.querySelector<HTMLInputElement>("#bottomNav .rightbtn");
    confirmButton?.click();

    return { success: true };
  };

  // APP 6
  if (!stockData.interestsSum && !stockData.cashbacksSum) {
    return { success: true };
  }

  // Autoclose popup
  chrome.debugger.attach({ tabId }, "1.3", () => {
    chrome.debugger.sendCommand({ tabId }, "Page.enable");
    chrome.debugger.sendCommand({ tabId }, "Runtime.enable");

    chrome.debugger.onEvent.addListener((source, method) => {
      if (source.tabId === tabId && method === "Page.javascriptDialogOpening") {
        // Accept the dialog automatically
        chrome.debugger.sendCommand({ tabId }, "Page.handleJavaScriptDialog", { accept: true });
      }
    });
  });

  const [result] = await chrome.scripting.executeScript<[StockData], Result>({
    target: { tabId },
    func: fillApp6Internal,
    args: [stockData],
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result.result!;
};

export default fillApp6;
