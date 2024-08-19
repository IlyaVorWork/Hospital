import { Dispatch, SetStateAction } from "react";
import Input from "../input/Input";
import "./checkboxList.css";

export interface CheckboxListOptionProps {
  value: number | string;
  placeholder: string;
}

export interface CheckboxListProps {
  /**
   * Select options
   */
  options?: CheckboxListOptionProps[];
  /**
   * Checked values array
   */
  checkedValues: number[];
  /**
   * Select onChange action
   */
  setValues?: Dispatch<SetStateAction<number[]>>;
}

const CheckboxList = ({
  options,
  checkedValues,
  setValues,
}: CheckboxListProps) => {
  return (
    <div className="checkboxList">
      {options?.map((el) => {
        return (
          <Input
            type="checkbox"
            placeholder={el.placeholder}
            isChecked={checkedValues.includes(
              typeof el.value === "string" ? parseInt(el.value) : el.value
            )}
            value={el.value}
            onChange={(event) =>
              setValues!((prev) =>
                prev.includes(parseInt(event.target.value))
                  ? prev.filter((el) => el !== parseInt(event.target.value))
                  : [...prev, parseInt(event.target.value)]
              )
            }
          />
        );
      })}
    </div>
  );
};

export default CheckboxList;
