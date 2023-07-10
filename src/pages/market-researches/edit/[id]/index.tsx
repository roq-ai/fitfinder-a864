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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getMarketResearchById, updateMarketResearchById } from 'apiSdk/market-researches';
import { Error } from 'components/error';
import { marketResearchValidationSchema } from 'validationSchema/market-researches';
import { MarketResearchInterface } from 'interfaces/market-research';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProductIdeaInterface } from 'interfaces/product-idea';
import { getProductIdeas } from 'apiSdk/product-ideas';

function MarketResearchEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MarketResearchInterface>(
    () => (id ? `/market-researches/${id}` : null),
    () => getMarketResearchById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MarketResearchInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMarketResearchById(id, values);
      mutate(updated);
      resetForm();
      router.push('/market-researches');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MarketResearchInterface>({
    initialValues: data,
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
            Edit Market Research
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(MarketResearchEditPage);
