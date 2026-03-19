"use client";
import { useState, useCallback, useEffect } from "react";
import { Delete } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type ButtonVariant = "number" | "operator" | "action" | "equals";

interface CalcButton {
  label: string | React.ReactNode;
  value: string;
  variant: ButtonVariant;
  wide?: boolean;
}

const BUTTON_STYLE: Record<ButtonVariant, string> = {
  number:
    "bg-surface hover:bg-white/[0.07] border border-line text-soft hover:border-white/10",
  operator:
    "bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:border-primary/40",
  action:
    "bg-white/[0.04] hover:bg-white/[0.08] border border-line text-muted hover:text-soft hover:border-white/10",
  equals:
    "bg-primary hover:bg-blue-500 border border-primary text-white shadow-lg shadow-primary/20",
};

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
        setJustEvaluated(false);
      } else {
        const next =
          justEvaluated
            ? digit
            : display === "0"
            ? digit
            : display.length >= 16
            ? display
            : display + digit;
        setDisplay(next);
        if (justEvaluated) setExpression("");
        setJustEvaluated(false);
      }
    },
    [display, waitingForOperand, justEvaluated]
  );

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
    setJustEvaluated(false);
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    const val = parseFloat(display);
    if (val !== 0) setDisplay(String(-val));
  }, [display]);

  const inputPercent = useCallback(() => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
    setJustEvaluated(false);
  }, [display]);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustEvaluated(false);
  }, []);

  const deleteLast = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  }, [display]);

  const handleOperator = useCallback(
    (op: string) => {
      const current = parseFloat(display);

      if (prevValue !== null && operator && !waitingForOperand) {
        const result = calculate(prevValue, current, operator);
        const resultStr = formatResult(result);
        setExpression(`${resultStr} ${op}`);
        setDisplay(resultStr);
        setPrevValue(result);
      } else {
        setExpression(`${display} ${op}`);
        setPrevValue(current);
      }
      setOperator(op);
      setWaitingForOperand(true);
      setJustEvaluated(false);
    },
    [display, prevValue, operator, waitingForOperand]
  );

  const handleEquals = useCallback(() => {
    const current = parseFloat(display);
    if (prevValue !== null && operator) {
      const result = calculate(prevValue, current, operator);
      const resultStr = formatResult(result);
      setExpression(`${prevValue} ${operator} ${current} =`);
      setDisplay(resultStr);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setJustEvaluated(true);
    }
  }, [display, prevValue, operator]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
      else if (e.key === ".") inputDecimal();
      else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/")
        handleOperator(e.key);
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Backspace") deleteLast();
      else if (e.key === "Escape") clearAll();
      else if (e.key === "%") inputPercent();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [inputDigit, inputDecimal, handleOperator, handleEquals, deleteLast, clearAll, inputPercent]);

  function calculate(a: number, b: number, op: string): number {
    switch (op) {
      case "+": return a + b;
      case "−":
      case "-": return a - b;
      case "×":
      case "*": return a * b;
      case "÷":
      case "/": return b !== 0 ? a / b : 0;
      default: return b;
    }
  }

  function formatResult(val: number): string {
    if (!isFinite(val)) return "Error";
    const str = String(val);
    // avoid very long floating numbers
    if (str.includes(".") && str.split(".")[1].length > 10) {
      return parseFloat(val.toPrecision(12)).toString();
    }
    return str;
  }

  // Format display with thousand separator (visual only)
  function formatDisplay(val: string): string {
    if (val === "Error") return val;
    const [int, dec] = val.split(".");
    const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec !== undefined ? `${formatted}.${dec}` : formatted;
  }

  const buttons: CalcButton[] = [
    { label: "AC", value: "clear", variant: "action" },
    { label: "+/−", value: "sign", variant: "action" },
    { label: "%", value: "%", variant: "action" },
    { label: "÷", value: "÷", variant: "operator" },

    { label: "7", value: "7", variant: "number" },
    { label: "8", value: "8", variant: "number" },
    { label: "9", value: "9", variant: "number" },
    { label: "×", value: "×", variant: "operator" },

    { label: "4", value: "4", variant: "number" },
    { label: "5", value: "5", variant: "number" },
    { label: "6", value: "6", variant: "number" },
    { label: "−", value: "−", variant: "operator" },

    { label: "1", value: "1", variant: "number" },
    { label: "2", value: "2", variant: "number" },
    { label: "3", value: "3", variant: "number" },
    { label: "+", value: "+", variant: "operator" },

    { label: "0", value: "0", variant: "number", wide: true },
    { label: ".", value: ".", variant: "number" },
    { label: "=", value: "=", variant: "equals" },
  ];

  const handleButton = (value: string) => {
    if (value >= "0" && value <= "9") inputDigit(value);
    else if (value === ".") inputDecimal();
    else if (value === "clear") clearAll();
    else if (value === "sign") toggleSign();
    else if (value === "%") inputPercent();
    else if (value === "=") handleEquals();
    else if (value === "del") deleteLast();
    else handleOperator(value);
  };

  const displayLength = formatDisplay(display).length;
  const displaySize =
    displayLength > 14
      ? "text-2xl"
      : displayLength > 10
      ? "text-3xl"
      : displayLength > 7
      ? "text-4xl"
      : "text-5xl";

  return (
    <ToolLayout
      title="Calculator"
      description="Kalkulator serbaguna. Mendukung keyboard input."
    >
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          {/* Display */}
          <div className="bg-surface border border-line rounded-2xl p-5 mb-3 min-h-[110px] flex flex-col justify-between overflow-hidden">
            {/* Expression */}
            <div className="text-muted/50 text-sm font-mono text-right min-h-[20px] truncate">
              {expression || "\u00A0"}
            </div>

            {/* Main display */}
            <div
              className={`text-right font-mono text-soft font-light tracking-tight transition-all ${displaySize}`}
            >
              {formatDisplay(display)}
            </div>
          </div>

          {/* Delete row */}
          <div className="flex justify-end mb-2 px-1">
            <button
              onClick={deleteLast}
              className="flex items-center gap-1.5 text-xs text-muted/40 hover:text-muted transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.04]"
              title="Backspace"
            >
              <Delete size={13} /> del
            </button>
          </div>

          {/* Button grid */}
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn, i) => (
              <button
                key={i}
                onClick={() => handleButton(btn.value)}
                className={`
                  ${btn.wide ? "col-span-2" : ""}
                  ${BUTTON_STYLE[btn.variant]}
                  h-14 rounded-xl text-base font-medium
                  active:scale-95 transition-all duration-100
                  flex items-center justify-center
                  select-none
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-muted/30 text-xs mt-5 font-mono">
            keyboard supported · Esc to clear
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
