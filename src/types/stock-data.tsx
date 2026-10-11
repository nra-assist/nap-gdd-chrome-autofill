import { Holding } from "./holding.tsx";
import { Dividend } from "./dividend.tsx";
import { UnregulatedSellsSum } from "./unregulated-sells-sum.tsx";
import { CryptoSellsSum } from "./cryptoSells-sum.tsx";
import { RegulatedSellsSum } from "./regulated-sells-sum.tsx";
import { Merger } from "./merger.tsx";

export interface StockData {
  holdings: Holding[] | undefined;
  dividends: Dividend[] | undefined;
  mergers: Merger[] | undefined;
  unregulatedSellsSum: UnregulatedSellsSum | undefined;
  cryptoSellsSum: CryptoSellsSum | undefined;
  regulatedSellsSum: RegulatedSellsSum | undefined;
  interestsSum: string | undefined;
  cashbacksSum: string | undefined;
}
