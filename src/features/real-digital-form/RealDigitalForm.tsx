import React, { useEffect } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { updateFormParameters } from './realDigitalFormSlice';

export function RealDigitalForm({
  action,
  method,
  children,
}: {
  action: string;
  method: string;
  children: React.ReactElement[];
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateFormParameters({ method, apiUrl: action }));
  }, [method, action]);

  return <form>{children}</form>;
}
