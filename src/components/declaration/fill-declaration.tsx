import { toast } from "react-toastify";
import { StockData } from "../../types/stock-data.tsx";
import { getCurrentTab } from "../../services/chrome-service.tsx";
import fillApp8 from "./fill-app8.tsx";
import fillApp5 from "./fill-app5.tsx";
import fillApp13 from "./fill-app13.tsx";
import fillApp6 from "./fill-app6.tsx";

export async function fillDeclaration(
  file: File,
  clearUploadedFile: () => void,
  setIsProcessing: (val: boolean) => void,
) {
  setIsProcessing(true);

  let stockData: StockData;
  try {
    const text = await file.text();
    stockData = JSON.parse(text);
  } catch (error) {
    console.error(error);
    toast.error(
      "Грешка! Неуспешно прочитане на входните данни. Моля, уверете се, че изпращате правилния JSON файл 'nra-assist.json', генериран от Nra Assist.",
      { autoClose: 6000 },
    );
    setIsProcessing(false);
    return;
  }

  const tab = await getCurrentTab();
  if (!tab.url!.startsWith("https://portal.nra.bg/")) {
    toast.error("Грешка! Моля, отидете на таба с ГДД към НАП!", { autoClose: 3000 });
    setIsProcessing(false);
    return;
  }

  let result = await fillApp8(tab.id!, stockData);
  if (result.error) {
    toast.error(result.error, { autoClose: result.toastDuration });
    setIsProcessing(false);
    return;
  }

  result = await fillApp5(tab.id!, stockData);
  if (result.error) {
    toast.error(result.error, { autoClose: result.toastDuration });
    setIsProcessing(false);
    return;
  }

  result = await fillApp13(tab.id!, stockData);
  if (result.error) {
    toast.error(result.error, { autoClose: result.toastDuration });
    setIsProcessing(false);
    return;
  }

  result = await fillApp6(tab.id!, stockData);
  if (result.error) {
    toast.error(result.error, { autoClose: result.toastDuration });
    setIsProcessing(false);
    return;
  }

  toast.success("Данните са добавени успешно!", { autoClose: 2000 });
  clearUploadedFile();
  setIsProcessing(false);
}
