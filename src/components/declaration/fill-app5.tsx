import { Result } from "../../types/result.tsx";
import { StockData } from "../../types/stock-data.tsx";

const fillApp5 = async (tabId: number, stockData: StockData): Promise<Result> => {
  const fillApp5Internal = (stockData: StockData): Result => {
    // HELPERS
    const updateSelect = (name: string, value: string) => {
      value = decodeURIComponent(encodeURIComponent(value));
      const selectEl = document.querySelector<HTMLSelectElement>(`select[name="${name}"]`);
      if (selectEl) {
        for (let i = 0; i < selectEl.options.length; i++) {
          if (selectEl.options[i].text.localeCompare(value) === 0) {
            selectEl.selectedIndex = i;
            break;
          }
        }
      }
    };

    const updateInput = (name: string, value: string) => {
      const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (input) input.value = value;
    };

    // APP 5 INTERNAL
    const item = document.getElementById("part_1229")!;
    const anchor = item.querySelector("a")!;
    anchor.click();

    updateSelect("dec50_app5_table2_rowenum[1]_code", "508");
    updateInput("dec50_app5_table2_rowenum[1]_sellvalue", stockData.unregulatedSellsSum.sellValue);
    updateInput("dec50_app5_table2_rowenum[1]_buyvalue", stockData.unregulatedSellsSum.buyValue);

    const profit = Number(stockData.unregulatedSellsSum.profit);
    if (profit >= 0) {
      updateInput("dec50_app5_table2_rowenum[1]_profit", profit.toString());
      updateInput("dec50_app5_t2row4pr", profit.toString());
      updateInput("dec50_app5_t2row5", profit.toString());

      const includedExpenses = 0.1 * profit;
      const actualProfit = profit - includedExpenses;
      updateInput("dec50_app5_t2row6", includedExpenses.toFixed(2));
      updateInput("dec50_app5_t2row7", actualProfit.toString());

      updateInput("dec50_app5_part2row1", actualProfit.toString());
      updateInput("dec50_app5_part2row4", actualProfit.toString());
    } else {
      const loss = Math.abs(profit);
      updateInput("dec50_app5_table2_rowenum[1]_loss", loss.toString());
    }

    const confirmButton = document.querySelector<HTMLInputElement>("#bottomNav .rightbtn");
    confirmButton?.click();

    return { success: true };
  };

  // APP 5
  if (!stockData.unregulatedSellsSum) {
    return { success: true };
  }

  const [result] = await chrome.scripting.executeScript<[StockData], Result>({
    target: { tabId },
    func: fillApp5Internal,
    args: [stockData],
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result.result!;
};

export default fillApp5;
