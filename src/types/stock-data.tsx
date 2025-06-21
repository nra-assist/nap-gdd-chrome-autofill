import { Holding } from "./holding.tsx";
import { Dividend } from "./dividend.tsx";
import { UnregulatedSellsSum } from "./unregulated-sells-sum.tsx";
import { RegulatedSellsSum } from "./regulated-sells-sum.tsx";

export interface StockData {
  holdings: Holding[];
  dividends: Dividend[];
  unregulatedSellsSum: UnregulatedSellsSum;
  regulatedSellsSum: RegulatedSellsSum;
  interestsSum: string;
  cashbacksSum: string;
}
