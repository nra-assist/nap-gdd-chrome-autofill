import { toast } from "react-toastify";
import { StockData } from "../../types/stock-data.tsx";
import { getCurrentTab } from "../../services/chrome-service.tsx";
import fillApp8 from "./fill-app8.tsx";
import fillApp5 from "./fill-app5.tsx";
import fillApp13 from "./fill-app13.tsx";
import fillApp6 from "./fill-app6.tsx";
import fillPart3 from "./fill-part3.tsx";
import { UnregulatedSellsSum } from "../../types/unregulated-sells-sum.tsx";
import { RegulatedSellsSum } from "../../types/regulated-sells-sum.tsx";

function safeSumStringNumbers(a: string | undefined, b: string | undefined): string | undefined {
  if (a === undefined && b === undefined) {
    return undefined;
  }
  const numA = a ? Number(a) : 0;
  const numB = b ? Number(b) : 0;
  return (numA + numB).toString();
}

function safeMergeUnregulatedSellsSum(
  a: UnregulatedSellsSum | undefined,
  b: UnregulatedSellsSum | undefined,
): UnregulatedSellsSum | undefined {
  if (a === undefined && b === undefined) {
    return undefined;
  }

  const defaultSellsSum: UnregulatedSellsSum = { sellValue: "0", buyValue: "0", profit: "0" };
  const valA = a || defaultSellsSum;
  const valB = b || defaultSellsSum;

  return {
    sellValue: safeSumStringNumbers(valA.sellValue, valB.sellValue)!,
    buyValue: safeSumStringNumbers(valA.buyValue, valB.buyValue)!,
    profit: safeSumStringNumbers(valA.profit, valB.profit)!,
  };
}

function safeMergeRegulatedSellsSum(
  a: RegulatedSellsSum | undefined,
  b: RegulatedSellsSum | undefined,
): RegulatedSellsSum | undefined {
  if (a === undefined && b === undefined) {
    return undefined;
  }

  const defaultSellsSum: RegulatedSellsSum = { sellValue: "0", buyValue: "0" };
  const valA = a || defaultSellsSum;
  const valB = b || defaultSellsSum;

  return {
    sellValue: safeSumStringNumbers(valA.sellValue, valB.sellValue)!,
    buyValue: safeSumStringNumbers(valA.buyValue, valB.buyValue)!,
  };
}

function safeMergeArrays<T>(arr1: T[] | undefined, arr2: T[] | undefined): T[] | undefined {
  if (arr1 === undefined && arr2 === undefined) {
    return undefined;
  }

  const effectiveArr1 = arr1 || [];
  const effectiveArr2 = arr2 || [];

  return effectiveArr1.concat(effectiveArr2);
}

export function mergeStockData(stockDataArray: StockData[]): StockData {
  return stockDataArray.reduce(
    (prev: StockData, curr: StockData) => {
      return {
        holdings: safeMergeArrays(prev.holdings, curr.holdings),
        dividends: safeMergeArrays(prev.dividends, curr.dividends),
        unregulatedSellsSum: safeMergeUnregulatedSellsSum(prev.unregulatedSellsSum, curr.unregulatedSellsSum),
        regulatedSellsSum: safeMergeRegulatedSellsSum(prev.regulatedSellsSum, curr.regulatedSellsSum),
        interestsSum: safeSumStringNumbers(prev.interestsSum, curr.interestsSum),
        cashbacksSum: safeSumStringNumbers(prev.cashbacksSum, curr.cashbacksSum),
      };
    },
    {
      holdings: undefined,
      dividends: undefined,
      unregulatedSellsSum: undefined,
      regulatedSellsSum: undefined,
      interestsSum: undefined,
      cashbacksSum: undefined,
    },
  );
}

export async function fillDeclaration(
  files: File[],
  clearUploadedFile: () => void,
  setIsProcessing: (val: boolean) => void,
) {
  setIsProcessing(true);

  let stockDataList: StockData[];
  try {
    const parsedList = await Promise.all(
      files.map(async (file) => {
        try {
          const text = await file.text();
          return JSON.parse(text) as StockData;
        } catch (err) {
          console.error(`Failed to parse ${file.name}:`, err);
          return undefined;
        }
      }),
    );

    stockDataList = parsedList.filter((data): data is StockData => data !== undefined);
  } catch (error) {
    console.error(error);
    toast.error(
      "Грешка! Неуспешно прочитане на входните данни. Моля, уверете се, че изпращате правилни JSON файлове 'nra-assist.json', генерирани от Nra Assist.",
      { autoClose: 6000 },
    );
    setIsProcessing(false);
    return;
  }

  const stockData = mergeStockData(stockDataList);

  const tab = await getCurrentTab();
  if (!tab.url!.startsWith("https://portal.nra.bg/")) {
    toast.error("Грешка! Моля, отидете на таба с ГДД към НАП!", { autoClose: 3000 });
    setIsProcessing(false);
    return;
  }

  await fillPart3(tab.id!, stockData);
  await fillApp8(tab.id!, stockData);
  await fillApp5(tab.id!, stockData);
  await fillApp13(tab.id!, stockData);
  await fillApp6(tab.id!, stockData);

  toast.success("Данните са добавени успешно!", { autoClose: 2000 });
  clearUploadedFile();
  setIsProcessing(false);
}
