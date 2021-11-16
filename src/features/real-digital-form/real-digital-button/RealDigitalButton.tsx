import React from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectApiCallStatus, submitDataToApi } from '../realDigitalFormSlice';
import RealDigitalFormModule from '../RealDigitalForm.module.css';

const RealDigitalButton = ({ children }: { children: string }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectApiCallStatus);
  const isButtonDisabled = status === 'loading';

  const handleButtonClick = () => {
    dispatch(submitDataToApi());
  };

  return (
    <div className={RealDigitalFormModule.row}>
      <button
        className={RealDigitalFormModule.button}
        type="button"
        disabled={isButtonDisabled}
        onClick={handleButtonClick}
      >
        {children}
      </button>
    </div>
  );
};

export default RealDigitalButton;
