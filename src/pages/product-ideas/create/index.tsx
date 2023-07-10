import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createProductIdea } from 'apiSdk/product-ideas';
import { Error } from 'components/error';
import { productIdeaValidationSchema } from 'validationSchema/product-ideas';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { ProductIdeaInterface } from 'interfaces/product-idea';

function ProductIdeaCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ProductIdeaInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createProductIdea(values);
      resetForm();
      router.push('/product-ideas');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ProductIdeaInterface>({
    initialValues: {
      idea: '',
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: productIdeaValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Product Idea
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="idea" mb="4" isInvalid={!!formik.errors?.idea}>
            <FormLabel>Idea</FormLabel>
            <Input type="text" name="idea" value={formik.values?.idea} onChange={formik.handleChange} />
            {formik.errors.idea && <FormErrorMessage>{formik.errors?.idea}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'product_idea',
    operation: AccessOperationEnum.CREATE,
  }),
)(ProductIdeaCreatePage);
