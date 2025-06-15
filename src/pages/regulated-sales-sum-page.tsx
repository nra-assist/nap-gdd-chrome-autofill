import FileDrop from "../components/file-drop/file-drop.tsx";
import { useState } from "react";
import { toast } from "react-toastify";
import { getCurrentTab } from "../services/chrome-service.tsx";
import { Result } from "../types/result.tsx";
import { RegulatedSalesSum } from "../types/regulated-sales-sum.tsx";

export default function RegulatedSalesSumPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);

    let jsonData: RegulatedSalesSum;
    try {
      const text = await file!.text();
      jsonData = JSON.parse(text);
      console.error(jsonData);
    } catch (error) {
      console.error(error);
      toast.error(
        "Грешка! Неуспешно прочитане на входните данни. Моля, уверете се, че изпращате правилния JSON файл 'regulated-sales-sum.json', генериран от Nra Assist.",
        { autoClose: 6000 },
      );
      setIsProcessing(false);
      return;
    }

    if (!jsonData) {
      toast.warn("Изпратеният файл е празен!", { autoClose: 2000 });
      setIsProcessing(false);
      return;
    }

    const tab = await getCurrentTab();
    if (!tab.url!.startsWith("https://portal.nra.bg/")) {
      toast.error("Грешка! Моля, отидете на таба с ГДД към НАП!", { autoClose: 3000 });
      setIsProcessing(false);
      return;
    }

    const response = await chrome.scripting.executeScript<[RegulatedSalesSum], Result>({
      target: { tabId: tab.id! },
      func: fillStockForm,
      args: [jsonData],
    });

    const result = response[0].result!;

    if (result.error) {
      toast.error(result.error, { autoClose: result.toastDuration });
    } else {
      toast.success("Данните са добавени успешно!", { autoClose: 2000 });
    }

    setIsProcessing(false);
  };

  const fillStockForm = (
    regulatedSalesSum: RegulatedSalesSum,
  ): {
    success: boolean;
    error?: string;
    toastDuration?: number;
  } => {
    const updateRow = (salesSum: RegulatedSalesSum) => {
      updateInput("dec50_app13_table2_income5081", regulatedSalesSum.sellValue);
      updateInput("dec50_app13_table2_value5081", salesSum.buyValue);
    };

    const updateInput = (field: string, value: string) => {
      const inputEl = document.querySelector<HTMLInputElement>(`input[name="${field}"]`);
      if (inputEl) inputEl.value = value;
    };

    if (!document.querySelector('input[name="dec50_app13_table2_income5081"]')) {
      return {
        success: false,
        error: "Грешка! Моля, отидете на таба с Приложение 13 от ГДД към НАП!",
        toastDuration: 3000,
      };
    }

    updateRow(regulatedSalesSum);

    return { success: true };
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <FileDrop onFileChange={setFile} />
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          disabled={isProcessing || !file}
          className={`max-w-[400px] min-w-[250px] rounded-sm px-4 py-1.5 text-sm font-medium text-white md:w-1/3 ${isProcessing ? "bg-gray-500 opacity-50" : !file ? "bg-gray-400" : "cursor-pointer bg-indigo-600 dark:bg-indigo-700"} ${!isProcessing && file ? "hover:bg-indigo-700 dark:hover:bg-indigo-600" : ""} `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Попълване...
            </div>
          ) : (
            "Попълни Приложение 13 | Част 2 - Код 5081"
          )}
        </button>
      </div>
    </div>
  );
}
