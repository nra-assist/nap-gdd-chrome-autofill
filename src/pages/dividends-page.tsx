import FileDrop from "../components/file-drop/file-drop.tsx";
import { useState } from "react";
import { Dividend } from "../types/dividend.tsx";
import { toast } from "react-toastify";
import { getCurrentTab } from "../services/chrome-service.tsx";
import { Result } from "../types/result.tsx";

export default function DividendsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);

    let jsonData: Dividend[];
    try {
      const text = await file!.text();
      jsonData = JSON.parse(text);
      console.error(jsonData);
    } catch (error) {
      console.error(error);
      toast.error(
        "Грешка! Неуспешно прочитане на входните данни. Моля, уверете се, че изпращате правилния JSON файл 'holdings.json', генериран от Nra Assist.",
        { autoClose: 6000 },
      );
      setIsProcessing(false);
      return;
    }

    if (!jsonData.length) {
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

    const response = await chrome.scripting.executeScript<[Dividend[]], Result>({
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

  const fillStockForm = (data: Dividend[]): { success: boolean; error?: string; toastDuration?: number } => {
    const getLastA8D5Index = () => {
      const rows = document.querySelectorAll('tr[id^="A8D5:"]');
      const lastRow = rows[rows.length - 1];
      const parts = lastRow.id.split(":");
      return parts.length > 1 ? parseInt(parts[1], 10) : 1;
    };

    const isStartingRowEmpty = (startIndex: number) => {
      const selectors = [
        `input[id="A8D5:${startIndex}_name"]`,
        `select[id="A8D5:${startIndex}_country"]`,
        `select[id="A8D5:${startIndex}_incomecode"]`,
        `select[id="A8D5:${startIndex}_methodcode"]`,
        `input[id="A8D5:${startIndex}_sum"]`,
        `input[id="A8D5:${startIndex}_value"]`,
        `input[id="A8D5:${startIndex}_diff"]`,
        `input[id="A8D5:${startIndex}_paidtax"]`,
        `input[id="A8D5:${startIndex}_permitedtax"]`,
        `input[id="A8D5:${startIndex}_tax"]`,
        `input[id="A8D5:${startIndex}_owetax"]`,
      ];
      return selectors.every((selector) => {
        const el = document.querySelector(selector);
        return (
          !el ||
          (el instanceof HTMLInputElement && el.value.trim() === "") ||
          (el instanceof HTMLSelectElement && (el.selectedIndex === -1 || el.value === ""))
        );
      });
    };

    const updateRow = (index: number, dividend: Dividend) => {
      updateInput(index, "name", dividend.name);
      updateSelect(index, "country", dividend.country);
      updateSelect(index, "incomecode", "8141");
      updateSelect(index, "methodcode", "1");
      updateInput(index, "sum", dividend.sum.toString());
      updateInput(index, "value", "0.00");
      updateInput(index, "value", "0.00");
      updateInput(index, "diff", "0.00");
      updateInput(index, "paidtax", dividend.paidTax.toString());
      updateInput(index, "permitedtax", "0.00");
      updateInput(index, "tax", dividend.paidTax.toString());
      updateInput(index, "owetax", "0.00");
    };

    const updateSelect = (index: number, field: string, value: string) => {
      value = decodeURIComponent(encodeURIComponent(value));
      const selectEl = document.querySelector<HTMLSelectElement>(`select[id="A8D5:${index}_${field}"]`);
      if (selectEl) {
        for (let i = 0; i < selectEl.options.length; i++) {
          if (selectEl.options[i].text.localeCompare(value) === 0) {
            selectEl.selectedIndex = i;
            break;
          }
        }
      }
    };

    const updateInput = (index: number, field: string, value: string) => {
      const inputEl = document.querySelector<HTMLInputElement>(`input[id="A8D5:${index}_${field}"]`);
      if (inputEl) inputEl.value = value;
    };

    if (!document.querySelector('tr[id="A8D5:1"]')) {
      return {
        success: false,
        error: "Грешка! Моля, отидете на таба с Приложение 8 от ГДД към НАП!",
        toastDuration: 3000,
      };
    }

    const addRowButton = Array.from(document.querySelectorAll<HTMLButtonElement>("button#A8D5"))[1];
    if (!addRowButton) {
      return {
        success: false,
        error:
          "Грешка! Текущата версия на разширението не работи с последната версия на сайта на НАП. Моля, съвржете се с нас!",
        toastDuration: 6000,
      };
    }

    let startIndex = getLastA8D5Index();
    const startingRowEmpty = isStartingRowEmpty(startIndex);

    if (startingRowEmpty) {
      updateRow(startIndex, data[0]);
    }

    startIndex++;
    data.slice(startingRowEmpty ? 1 : 0).forEach((dividend, i) => {
      addRowButton.click();
      updateRow(startIndex + i, dividend);
    });

    return { success: true };
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <FileDrop onFileChange={setFile} />
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          disabled={isProcessing || !file}
          className={`max-w-[300px] rounded-sm px-4 py-2 text-sm font-medium text-white md:w-1/3 ${isProcessing ? "bg-gray-500 opacity-50" : !file ? "bg-gray-400" : "cursor-pointer bg-indigo-600 dark:bg-indigo-700"} ${!isProcessing && file ? "hover:bg-indigo-700 dark:hover:bg-indigo-600" : ""} `}
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
            "Попълни Приложение 8 Част 3"
          )}
        </button>
      </div>
    </div>
  );
}
