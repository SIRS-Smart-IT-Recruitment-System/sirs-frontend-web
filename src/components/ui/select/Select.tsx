<<<<<<< HEAD

=======
>>>>>>> origin/master
import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import "./Select.css";

<<<<<<< HEAD

=======
>>>>>>> origin/master
interface SelectOption {
    label: string;
    value: string;
}

<<<<<<< HEAD

=======
>>>>>>> origin/master
interface SelectProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

<<<<<<< HEAD
function Select({
                    label,
                    error,
                    options,
                    placeholder = "Vui lòng chọn",
                    id,
                    disabled = false,
                    className = "",
                    ...props
                }: SelectProps) {
=======
function Select({label, error, options, placeholder = "Vui lòng chọn", id, disabled = false, className = "", ...props}: SelectProps) {

>>>>>>> origin/master
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
        <div className="select-group">
            {label && (
                <label htmlFor={selectId} className="select-label">
                    {label}
                </label>
            )}

            <select
                id={selectId}
                className={`select-field ${error ? "has-error" : ""} ${className}`}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${selectId}-error` : undefined}
                {...props}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <span id={`${selectId}-error`} className="select-error">
          {error}
        </span>
            )}
        </div>
    );
}

export default Select;
