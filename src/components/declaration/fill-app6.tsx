import { StockData } from "../../types/stock-data.tsx";

const fillApp6 = async (tabId: number, stockData: StockData): Promise<void> => {
  const fillApp6Internal = (stockData: StockData): void => {
    // HELPERS
    const updateInput = (name: string, value: string) => {
      const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (input) {
        input.value = value;
      }
    };

    const app6Anchor = Array.from(document.querySelectorAll<HTMLAnchorElement>("li > a.item")).find(
      (a) => a.textContent?.trim() === "Приложение 6",
    );
    app6Anchor?.click();

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
  };

  // APP 6
  if (!stockData.interestsSum && !stockData.cashbacksSum) {
    return;
  }

  // Autoclose popup
  const debuggee = { tabId };
  const onDialog = (
    source: chrome.debugger.Debuggee,
    method: string
  ) => {
    if (source.tabId === tabId && method === "Page.javascriptDialogOpening") {
      chrome.debugger.sendCommand(
        debuggee,
        "Page.handleJavaScriptDialog",
        { accept: true }
      );
    }
  };

  try {
    await new Promise<void>((resolve, reject) => {
      chrome.debugger.attach(debuggee, "1.3", () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        chrome.debugger.sendCommand(debuggee, "Page.enable");
        chrome.debugger.sendCommand(debuggee, "Runtime.enable");
        chrome.debugger.onEvent.addListener(onDialog);
        resolve();
      });
    });

    await chrome.scripting.executeScript<[StockData], void>({
      target: { tabId },
      func: fillApp6Internal,
      args: [stockData],
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    chrome.debugger.onEvent.removeListener(onDialog);
    chrome.debugger.detach(debuggee);
  }
};

export default fillApp6;
