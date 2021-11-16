import { FormDataSpec } from './realDigitalFormSlice';

export async function submitData(data: FormDataSpec, apiUrl: string, method: string) {
  return await fetch(apiUrl, {
    method,
    body: JSON.stringify(data),
  });
}
