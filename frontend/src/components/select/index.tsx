import { Funnel } from "lucide-react";

import "./css/styles.css";

export type SelectInputProps = {
  options: {
    label: string;
    value: number;
  }[];
  placeholder: string;
  onValueChange?: (value: number) => unknown;
};

export const SelectInput = ({
  options,
  placeholder,
  onValueChange,
}: SelectInputProps) => {
  return (
    <div className="input-container">
      <div className="icon-area">
        <Funnel />
      </div>
      <select
        onChange={
          onValueChange
            ? (e) => onValueChange?.(Number(e.target.value))
            : undefined
        }
      >
        <option disabled selected label={placeholder} value={-1}>
          {placeholder}
        </option>
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};
