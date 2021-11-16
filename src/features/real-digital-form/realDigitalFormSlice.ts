import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { submitData } from './realDigitalFormAPI';

export interface CounterState extends FormParamSpec {
  formData: FormDataSpec;
  status: 'idle' | 'loading' | 'failed' | 'success';
  apiResponse: string;
  formValidity: FieldValiditySpec;
}

export interface FormDataSpec {
  [key: string]: FormDataElementSpec;
}

export interface FormDataElementSpec {
  value: string;
  validation?: string;
  isValid?: boolean;
}

interface FieldValiditySpec {
  [key: string]: boolean | undefined;
}

interface FormParamSpec {
  method: string;
  apiUrl: string;
}

export interface SubmitDataApiParamSpec {
  formData: FormDataSpec;
  apiUrl: string;
  method: string;
}

export interface InputFieldPropsSpec {
  name: string;
  validation?: string;
}

const initialState: CounterState = {
  formData: {},
  status: 'idle',
  apiResponse: '',
  formValidity: {},
  method: '',
  apiUrl: '',
};

const canSubmitForm = (formData: FormDataSpec) => {
  let isValid = true;
  Object.keys(formData).forEach((key: string) => {
    isValid = isValid && (formData[key].isValid as boolean);
  });
  return isValid;
};

export const submitDataToApi = createAsyncThunk('realDigitalForm/submitData', async (_, { getState, dispatch }) => {
  const { realDigitalForm }: RootState = getState() as RootState;

  dispatch(updateFormValidationData());
  const isFormDataValid = canSubmitForm(realDigitalForm.formData);

  if (isFormDataValid) {
    const { formData, method, apiUrl } = realDigitalForm;
    const response = await submitData(formData, apiUrl, method);
    const result = response.json();
    return result;
  }
});

const isFieldValueValid = (data: FormDataElementSpec) => {
  const { value, validation } = data;
  const isValid = validation ? new RegExp(validation).test(value as string) : true;

  return isValid;
};

export const counterSlice = createSlice({
  name: 'realDigitalForm',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<FormDataSpec>) => {
      const fieldName: string = Object.keys(action.payload)[0];
      const isValid = isFieldValueValid(action.payload[fieldName]);

      state.formData = { ...state.formData, ...action.payload };
      state.formValidity[fieldName] = isValid;
    },
    updateFormValidationData: (state) => {
      const { formData } = state;
      let formValidatedData: FormDataSpec = {};

      Object.keys(formData).forEach((fieldName) => {
        const fieldData: FormDataElementSpec = formData[fieldName];
        const { value } = fieldData;
        let isValid = false;

        if (!fieldData.validation) {
          isValid = true;
        } else if (fieldData.validation && value.length === 0) {
          isValid = false;
        } else {
          isValid = new RegExp(fieldData?.validation as string).test(value);
        }
        formValidatedData[fieldName] = { ...fieldData, isValid };
      });

      state.formData = formValidatedData;
    },
    initializeFormValidityData: (state, action: PayloadAction<InputFieldPropsSpec>) => {
      const { name, validation } = action.payload;
      state.formValidity[name] = undefined;
      state.formData[name] = { value: '', validation, isValid: true };
    },
    updateFormParameters: (state, action: PayloadAction<FormParamSpec>) => {
      const { apiUrl, method } = action.payload;
      state.apiUrl = apiUrl;
      state.method = method;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDataToApi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitDataToApi.fulfilled, (state, action) => {
        state.status = 'success';
        state.apiResponse = action.payload;
      })
      .addCase(submitDataToApi.rejected, (state, action) => {
        state.status = 'failed';
        state.apiResponse = action.payload as string;
      });
  },
});

export const { updateFormData, updateFormParameters, updateFormValidationData, initializeFormValidityData } =
  counterSlice.actions;

export const selectFormData = (state: RootState) => state.realDigitalForm.formData;
export const selectApiCallStatus = (state: RootState) => state.realDigitalForm.status;

export default counterSlice.reducer;
