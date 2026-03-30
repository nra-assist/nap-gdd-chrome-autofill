import { Holding } from "../../types/holding.tsx";
import { Dividend } from "../../types/dividend.tsx";
import { Merger } from "../../types/merger.tsx";
import { StockData } from "../../types/stock-data.tsx";

const fillApp8 = async (tabId: number, stockData: StockData): Promise<void> => {
  const fillApp8Internal = async (stockData: StockData): Promise<void> => {
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
    const fillHoldings = async (holdings: Holding[]): Promise<void> => {
      if (holdings.length === 0) {
        console.info("No holdings to process");
        return;
      }

      const addRowButton = document.querySelectorAll<HTMLButtonElement>("button#A8D1")[1];

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
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      row++;
      const remainingHoldings = holdings.slice(empty ? 1 : 0);

      for (let i = 0; i < remainingHoldings.length; i++) {
        addRowButton.click();
        await new Promise((resolve) => setTimeout(resolve, 50));
        updateRow(row + i, remainingHoldings[i]);
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    };

    // DIVIDENDS
    const fillDividends = async (dividends: Dividend[]): Promise<void> => {
      if (dividends.length === 0) {
        console.info("No dividends to process");
        return;
      }

      const addRowButton = document.querySelectorAll<HTMLButtonElement>("button#A8D5")[1];

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
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      row++;
      const remainingDividends = dividends.slice(empty ? 1 : 0);

      for (let i = 0; i < remainingDividends.length; i++) {
        addRowButton.click();
        await new Promise((resolve) => setTimeout(resolve, 50));
        updateRow(row + i, remainingDividends[i]);
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    };

    // MERGERS
    const fillMergers = async (mergers: Merger[]): Promise<void> => {
      if (mergers.length === 0) {
        console.info("No mergers to process");
        return;
      }

      const addRowButton = document.querySelectorAll<HTMLButtonElement>("button#A8D6")[1];

      let row = getLastRowIndex("A8D6");
      const empty = isRowEmpty("A8D6", row, [
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

      const updateRow = (row: number, m: Merger) => {
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_name`, m.targetCompanyName);
        updateSelect(`dec50_app8_part38al58_rowenum[${row}]_country`, m.targetCountry);
        updateSelect(`dec50_app8_part38al58_rowenum[${row}]_incomecode`, "815");
        updateSelect(`dec50_app8_part38al58_rowenum[${row}]_methodcode`, "3");
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_sum`, m.targetPriceInBgn);
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_value`, m.sourceCostPriceInBgn);
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_diff`, "0.00");
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_paidtax`, "0.00");
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_permitedtax`, "0.00");
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_tax`, "0.00");

        // Calculate positive difference and tax
        const targetPrice = parseFloat(m.targetPriceInBgn);
        const sourcePrice = parseFloat(m.sourceCostPriceInBgn);
        const diff = targetPrice - sourcePrice;
        const positiveDiff = diff > 0 ? diff : 0;
        const tax = positiveDiff * 0.1; // 10% tax

        updateInput(`dec50_app8_part38al58_rowenum[${row}]_diff`, positiveDiff.toFixed(2));
        updateInput(`dec50_app8_part38al58_rowenum[${row}]_owetax`, tax.toFixed(2));
      };

      if (empty) {
        updateRow(row, mergers[0]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      row++;
      const remainingMergers = mergers.slice(empty ? 1 : 0);

      for (let i = 0; i < remainingMergers.length; i++) {
        addRowButton.click();
        await new Promise((resolve) => setTimeout(resolve, 50));
        updateRow(row + i, remainingMergers[i]);
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    };

    // APP 8 INTERNAL
    const app8Anchor = Array.from(document.querySelectorAll<HTMLAnchorElement>("li > a.item")).find(
      (a) => a.textContent?.trim() === "Приложение 8",
    );
    app8Anchor?.click();

    if (stockData.holdings) {
      await fillHoldings(stockData.holdings);
    }

    if (stockData.dividends) {
      await fillDividends(stockData.dividends);
    }

    if (stockData.mergers) {
      await fillMergers(stockData.mergers);
    }

    setTimeout(() => {
      const confirmButton = document.querySelector<HTMLInputElement>("#bottomNav .rightbtn");
      confirmButton?.click();
    }, 2000);
  };

  // APP 8
  if (!stockData.holdings && !stockData.dividends && !stockData.mergers) {
    return;
  }

  await chrome.scripting.executeScript<[StockData], void>({
    target: { tabId },
    func: fillApp8Internal,
    args: [stockData],
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));
};

export default fillApp8;
