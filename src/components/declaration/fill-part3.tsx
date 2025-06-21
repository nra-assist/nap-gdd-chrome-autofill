import { StockData } from "../../types/stock-data.tsx";

const fillPart3 = async (tabId: number, stockData: StockData): Promise<void> => {
  const fillPart3Internal = (stockData: StockData): void => {
    // HELPERS
    const setCheckboxToChecked = (name: string) => {
      const checkbox = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (checkbox) {
        checkbox.checked = true;
        checkbox.value = "true";
      }
    };

    // PART 3 INTERNAL
    const item = document.getElementById("part_1222")!;
    const anchor = item.querySelector("a")!;
    anchor.click();

    if (stockData.holdings || stockData.dividends) {
      setCheckboxToChecked("dec50_part3_issetapp8");
    }

    if (stockData.unregulatedSellsSum) {
      setCheckboxToChecked("dec50_part3_issetapp5");
    }

    if (stockData.regulatedSellsSum) {
      setCheckboxToChecked("dec50_part3_issetapp13");
    }

    if (stockData.interestsSum || stockData.cashbacksSum) {
      setCheckboxToChecked("dec50_part3_issetapp6");
    }

    const confirmButton = document.querySelector<HTMLInputElement>("#bottomNav .rightbtn");
    confirmButton?.click();
  };

  // PART 3
  if (
    !stockData.holdings &&
    !stockData.dividends &&
    !stockData.unregulatedSellsSum &&
    !stockData.regulatedSellsSum &&
    !stockData.interestsSum &&
    !stockData.cashbacksSum
  ) {
    return;
  }

  await chrome.scripting.executeScript<[StockData], void>({
    target: { tabId },
    func: fillPart3Internal,
    args: [stockData],
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export default fillPart3;
