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
import { createMarketResearch } from 'apiSdk/market-researches';
import { Error } from 'components/error';
import { marketResearchValidationSchema } from 'validationSchema/market-researches';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProductIdeaInterface } from 'interfaces/product-idea';
import { getProductIdeas } from 'apiSdk/product-ideas';
import { MarketResearchInterface } from 'interfaces/market-research';

function MarketResearchCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MarketResearchInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMarketResearch(values);
      resetForm();
      router.push('/market-researches');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MarketResearchInterface>({
    initialValues: {
      data: '',
      product_idea_id: (router.query.product_idea_id as string) ?? null,
    },
    validationSchema: marketResearchValidationSchema,
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
            Create Market Research
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="data" mb="4" isInvalid={!!formik.errors?.data}>
            <FormLabel>Data</FormLabel>
            <Input type="text" name="data" value={formik.values?.data} onChange={formik.handleChange} />
            {formik.errors.data && <FormErrorMessage>{formik.errors?.data}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ProductIdeaInterface>
            formik={formik}
            name={'product_idea_id'}
            label={'Select Product Idea'}
            placeholder={'Select Product Idea'}
            fetcher={getProductIdeas}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.idea}
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
    entity: 'market_research',
    operation: AccessOperationEnum.CREATE,
  }),
)(MarketResearchCreatePage);
