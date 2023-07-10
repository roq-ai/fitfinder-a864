import * as yup from 'yup';

export const productIdeaValidationSchema = yup.object().shape({
  idea: yup.string().required(),
  company_id: yup.string().nullable().required(),
});
