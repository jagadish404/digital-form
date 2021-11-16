import React, { ChangeEvent, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { initializeFormValidityData, selectFormData, updateFormData } from '../realDigitalFormSlice';
import RealDigitalFormModule from '../RealDigitalForm.module.css';

export const RealDigitalTextfield = ({ name, validation }: { name: string; validation?: string }) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectFormData);
  const [value, setValue] = useState('');
  let isValid: boolean | undefined = undefined;

  if (formData[name]) {
    isValid = formData[name]?.isValid;
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.target;

    dispatch(updateFormData({ [name]: { value: inputValue, validation } }));
    setValue(inputValue);
  };

  useEffect(() => {
    dispatch(initializeFormValidityData({ name, validation }));
  }, [name]);

  return (
    <div className={RealDigitalFormModule.row}>
      <p className={RealDigitalFormModule.formInputRow}>
        <span className={RealDigitalFormModule.formLabel}>{name}: </span>
        <input data-testid={`input-field-${name}`} type="text" name={name} value={value} onChange={handleInput} />
      </p>
      {isValid !== undefined && !isValid && (
        <p className={RealDigitalFormModule.formError}>The value provided is invalid.</p>
      )}
    </div>
  );
};
