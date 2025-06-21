import { Holding } from "../../types/holding.tsx";
import { Result } from "../../types/result.tsx";
import { Dividend } from "../../types/dividend.tsx";
import { StockData } from "../../types/stock-data.tsx";

const fillApp8 = async (tabId: number, stockData: StockData): Promise<Result> => {
  const fillApp8Internal = (stockData: StockData): Result => {
    // HELPERS
    const getLastRowIndex = (prefix: string): number => {
      const rows = document.querySelectorAll(`tr[id^="${prefix}:"]`);
      if (!rows.length) {
        return 1;
      }

      const lastRow = rows[rows.length - 1];
      const parts = lastRow.id.split(":");
      return parts.length > 1 ? parseInt(parts[1], 10) : 1;
    };

    const isRowEmpty = (prefix: string, index: number, fields: string[]): boolean =>
      fields.every((field) => {
        const selector = `#${prefix}\\:${index}_${field}`;
        const el = document.querySelector(selector);
        return (
          !el ||
          (el instanceof HTMLInputElement && (el.value.trim() === "" || Number(el.value) === 0)) ||
          (el instanceof HTMLSelectElement && (el.selectedIndex === -1 || el.value === ""))
        );
      });

    const updateInput = (name: string, value: string) => {
      const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (input) {
        input.value = value;
      }
    };

    const updateSelect = (name: string, value: string) => {
      const select = document.querySelector<HTMLSelectElement>(`select[name="${name}"]`);
      if (!select) {
        return;
      }

      const normalizedValue = decodeURIComponent(encodeURIComponent(value));
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.localeCompare(normalizedValue) === 0) {
          select.selectedIndex = i;
          break;
        }
      }
    };

    const updateDate = (dateFieldHiddenName: string, dateDisplayFieldId: string, date: string) => {
      updateInput(dateFieldHiddenName, date);
      const [y, m, d] = date.split("-");
      const input = document.querySelector<HTMLInputElement>(`input[id="${dateDisplayFieldId}"]`);
      if (input) {
        input.value = `${d}.${m}.${y}`;
      }
    };

    // HOLDINGS
    const fillHoldings = (holdings: Holding[]): Result => {
      const addRowButton = document.querySelectorAll<HTMLButtonElement>("button#A8D1")[1];
      if (!addRowButton) {
        return {
          success: false,
          error: "Грешка! Разширението не е съвместимо с последната версия на сайта на НАП. Свържете се с нас!",
          toastDuration: 6000,
        };
      }

      let row = getLastRowIndex("A8D1");
      const empty = isRowEmpty("A8D1", row, ["country", "count", "acquiredate", "priceincurrency", "price"]);

      const updateRow = (row: number, holding: Holding) => {
        updateSelect(`dec50_app8_stocks_stocksenum[${row}]_country`, holding.country);
        updateInput(`dec50_app8_stocks_stocksenum[${row}]_count`, holding.count);
        updateDate(
          `dec50_app8_stocks_stocksenum[${row}]_acquiredate`,
          `A8D1:${row}_acquiredate_display`,
          holding.acquireDate,
        );
        updateInput(`dec50_app8_stocks_stocksenum[${row}]_priceincurrency`, holding.priceInCurrency);
        updateInput(`dec50_app8_stocks_stocksenum[${row}]_price`, holding.price);
      };

      if (empty) {
        updateRow(row, holdings[0]);
      }

      row++;
      holdings.slice(empty ? 1 : 0).forEach((h, i) => {
        addRowButton.click();
        updateRow(row + i, h);
      });

      return { success: true };
    };

    // DIVIDENDS
    const fillDividends = (dividends: Dividend[]): Result => {
      const addRowButton = document.querySelectorAll<HTMLButtonElement>("button#A8D5")[1];
      if (!addRowButton) {
        return {
          success: false,
          error: "Грешка! Разширението не е съвместимо с последната версия на сайта на НАП. Свържете се с нас!",
          toastDuration: 6000,
        };
      }

      let row = getLastRowIndex("A8D5");
      const empty = isRowEmpty("A8D5", row, [
        "name",
        "country",
        "incomecode",
        "methodcode",
        "sum",
        "value",
        "diff",
        "paidtax",
        "permitedtax",
        "tax",
        "owetax",
      ]);

      const updateRow = (row: number, d: Dividend) => {
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_name`, d.name);
        updateSelect(`dec50_app8_part38al1_rowenum[${row}]_country`, d.country);
        updateSelect(`dec50_app8_part38al1_rowenum[${row}]_incomecode`, "8141");
        updateSelect(`dec50_app8_part38al1_rowenum[${row}]_methodcode`, "1");
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_sum`, d.sum.toString());
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_value`, "0.00");
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_diff`, "0.00");
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_paidtax`, d.paidTax.toString());
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_permitedtax`, "0.00");
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_tax`, d.paidTax.toString());
        updateInput(`dec50_app8_part38al1_rowenum[${row}]_owetax`, "0.00");
      };

      if (empty) {
        updateRow(row, dividends[0]);
      }

      row++;
      dividends.slice(empty ? 1 : 0).forEach((d, i) => {
        addRowButton.click();
        updateRow(row + i, d);
      });

      return { success: true };
    };

    // APP 8 INTERNAL
    const item = document.getElementById("part_1232")!;
    const anchor = item.querySelector("a")!;
    anchor.click();

    if (stockData.holdings) {
      const holdingsResult = fillHoldings(stockData.holdings);
      if (!holdingsResult.success) {
        return holdingsResult;
      }
    }

    if (stockData.dividends) {
      const dividendsResult = fillDividends(stockData.dividends);
      if (!dividendsResult.success) {
        return dividendsResult;
      }
    }

    const confirmButton = document.querySelector<HTMLInputElement>("#bottomNav .rightbtn");
    confirmButton?.click();

    return { success: true };
  };

  // APP 8
  if (!stockData.holdings && !stockData.dividends) {
    return { success: true };
  }

  const [result] = await chrome.scripting.executeScript<[StockData], Result>({
    target: { tabId },
    func: fillApp8Internal,
    args: [stockData],
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result.result!;
};

export default fillApp8;
