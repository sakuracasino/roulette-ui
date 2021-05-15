import React from 'react';
import './NumberInput.scss';

type NumberInputProps = {
  value: string,
  onChange?: (value: string) => void,
  children?: any,
  labelText?: string,
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
}

const NumberInput = function ({value, onChange, children, labelText, onKeyDown}: NumberInputProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _value = event.target.value;
    if (
      isNaN(Number(_value)) ||
      Number(_value) < 0 ||
      _value.includes(' ')
    ) return;
    onChange && onChange(_value);
  };

  return (
    <label className="NumberInput__label">
      <span className="NumberInput__label-text">{labelText}</span>
      <div className="NumberInput__container">
        <input
          className="NumberInput"
          type="text"
          placeholder="0.0"
          pattern="^[0-9]*[.]?[0-9]*$"
          value={value}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
        />
        {children}
      </div>
    </label>
  );
};

export default NumberInput;
