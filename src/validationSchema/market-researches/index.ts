import * as yup from 'yup';

export const marketResearchValidationSchema = yup.object().shape({
  data: yup.string().required(),
  product_idea_id: yup.string().nullable().required(),
});
