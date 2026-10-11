import { StockData } from "../../types/stock-data.tsx";

interface SellsSum {
  sellValue: string;
  buyValue: string;
  profit: string;
}

interface App5Row {
  code: string;
  sellsSum: SellsSum;
}

const hasSellsData = (sum: SellsSum | undefined): sum is SellsSum =>
  !!sum && (Number(sum.sellValue) !== 0 || Number(sum.buyValue) !== 0 || Number(sum.profit) !== 0);

const fillApp5 = async (tabId: number, stockData: StockData): Promise<void> => {
  const fillApp5Internal = async (stockData: StockData): Promise<void> => {
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

    const rowHasData = (sum: SellsSum | undefined): boolean =>
      !!sum && (Number(sum.sellValue) !== 0 || Number(sum.buyValue) !== 0 || Number(sum.profit) !== 0);

    // APP 5 INTERNAL
    const app5Anchor = Array.from(document.querySelectorAll<HTMLAnchorElement>("li > a.item")).find(
      (a) => a.textContent?.trim() === "Приложение 5",
    );
    app5Anchor?.click();

    // Virtual currencies are reported under a dedicated code (5082), separately from other
    // financial assets (508). Both are unregulated-market disposals, so each class gets its own
    // row and the Table 2 totals below aggregate all rows.
    const rows: App5Row[] = [];
    if (rowHasData(stockData.unregulatedSellsSum)) {
      rows.push({ code: "508", sellsSum: stockData.unregulatedSellsSum! });
    }
    if (rowHasData(stockData.cryptoSellsSum)) {
      rows.push({ code: "5082", sellsSum: stockData.cryptoSellsSum! });
    }

    const rowCodeSelectName = (row: number) => `dec50_app5_table2_rowenum[${row}]_code`;

    const ensureRow = async (row: number): Promise<boolean> => {
      if (document.querySelector(`select[name="${rowCodeSelectName(row)}"]`)) {
        return true;
      }

      // The "add row" button keeps the same id as the row prefix (e.g. A5D2), matching the
      // App 8 tables. The id is not unique, so the last matching control is the add button.
      const addControls = document.querySelectorAll<HTMLElement>("button#A5D2, a#A5D2, #A5D2");
      const addButton = addControls[addControls.length - 1];
      if (!addButton) {
        return false;
      }

      addButton.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      return !!document.querySelector(`select[name="${rowCodeSelectName(row)}"]`);
    };

    for (let index = 0; index < rows.length; index++) {
      const row = index + 1;
      const { code, sellsSum } = rows[index];

      const rowReady = await ensureRow(row);
      if (!rowReady) {
        console.warn(`Could not add row ${row} to Приложение 5 Таблица 2; skipping code ${code}.`);
        continue;
      }

      updateSelect(rowCodeSelectName(row), code);
      updateInput(`dec50_app5_table2_rowenum[${row}]_sellvalue`, sellsSum.sellValue);
      updateInput(`dec50_app5_table2_rowenum[${row}]_buyvalue`, sellsSum.buyValue);

      const profit = Number(sellsSum.profit);
      if (profit >= 0) {
        updateInput(`dec50_app5_table2_rowenum[${row}]_profit`, profit.toString());
      } else {
        updateInput(`dec50_app5_table2_rowenum[${row}]_loss`, Math.abs(profit).toString());
      }
    }

    const totalProfit = rows.reduce((sum, row) => sum + Number(row.sellsSum.profit), 0);
    if (totalProfit >= 0) {
      updateInput("dec50_app5_t2row4pr", totalProfit.toString());
      updateInput("dec50_app5_t2row5", totalProfit.toString());

      const includedExpenses = 0.1 * totalProfit;
      const actualProfit = totalProfit - includedExpenses;
      updateInput("dec50_app5_t2row6", includedExpenses.toFixed(2));
      updateInput("dec50_app5_t2row7", actualProfit.toString());

      updateInput("dec50_app5_part2row1", actualProfit.toString());
      updateInput("dec50_app5_part2row4", actualProfit.toString());
    } else {
      updateInput("dec50_app5_t2row4ls", Math.abs(totalProfit).toString());
    }

    const confirmButton = document.querySelector<HTMLInputElement>("#bottomNav .rightbtn");
    confirmButton?.click();
  };

  // APP 5
  if (!hasSellsData(stockData.unregulatedSellsSum) && !hasSellsData(stockData.cryptoSellsSum)) {
    return;
  }

  await chrome.scripting.executeScript<[StockData], void>({
    target: { tabId },
    func: fillApp5Internal,
    args: [stockData],
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export default fillApp5;
