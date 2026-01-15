import { StockData } from "../../types/stock-data.tsx";

const fillApp13 = async (tabId: number, stockData: StockData): Promise<void> => {
  const fillApp13Internal = (stockData: StockData): void => {
    // HELPERS
    const updateInput = (name: string, value: string) => {
      const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (input) input.value = value;
    };

    // APP 13 INTERNAL
    const app13Anchor = Array.from(document.querySelectorAll<HTMLAnchorElement>("li > a.item")).find(
      (a) => a.textContent?.trim() === "Приложение 13",
    );
    app13Anchor?.click();

    updateInput("dec50_app13_table2_income5081", stockData.regulatedSellsSum!.sellValue);
    updateInput("dec50_app13_table2_value5081", stockData.regulatedSellsSum!.buyValue);

    const confirmButton = document.querySelector<HTMLInputElement>("#bottomNav .rightbtn");
    confirmButton?.click();
  };

  // APP 13
  if (stockData.regulatedSellsSum?.buyValue === "0" && stockData.regulatedSellsSum?.sellValue === "0") {
    return;
  }


  await chrome.scripting.executeScript<[StockData], void>({
    target: { tabId },
    func: fillApp13Internal,
    args: [stockData],
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export default fillApp13;
