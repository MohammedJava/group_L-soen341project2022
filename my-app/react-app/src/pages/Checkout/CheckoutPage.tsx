/* eslint-disable react/jsx-props-no-spreading */
//From MUI templates
//https://github.com/mui/material-ui/blob/v5.6.2/docs/data/material/getting-started/templates/checkout/Checkout.tsx
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import * as React from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import agent from '../../ApiCall/agent'
import { clearCart } from '../../components/Shopping/cartSlice'
import { useAppDispatch } from '../../store/configureStore'
import AddressForm from './AddressForm'
import PaymentForm from './PaymentForm'
import Review from './Review'
import validationSchema from './checkoutValidation'

const Copyright = () => (
  <Typography variant="body2" color="text.secondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://mui.com/">
      Your Website
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
)

const steps = ['Shipping address', 'Payment details', 'Review your order']

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />
    case 1:
      return <PaymentForm />
    case 2:
      return <Review />
    default:
      throw new Error('Unknown step')
  }
}

const theme = createTheme()

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = React.useState(1)
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  })

  const [orderNumber, setOrderNumber] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const dispatch = useAppDispatch()

  const handleNext = async (data: FieldValues) => {
    const { nameOnCard, saveAddress, ...shippingAddress } = data

    if (activeStep === steps.length - 1) {
      setLoading(true)
      try {
        const anOrderNumber = await agent.Orders.create({
          saveAddress,
          shippingAddress,
        })
        setOrderNumber(anOrderNumber)
        setActiveStep(activeStep + 1)
        dispatch(clearCart())
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
      console.log(data)
    }
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  React.useEffect(() => {
    agent.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({
          ...methods.getValues(),
          ...response,
          savedAddress: false,
        })
      }
    })
  }, [methods])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <FormProvider {...methods}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Typography component="h1" variant="h4" align="center">
              Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #{orderNumber}. We have emailed your
                  order confirmation, and will send you an update when your
                  order has shipped.
                </Typography>
              </>
            ) : (
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  <LoadingButton
                    loading={loading}
                    disabled={!methods.formState.isValid}
                    variant="contained"
                    type="submit"
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </LoadingButton>
                </Box>
              </form>
            )}
          </Paper>
        </FormProvider>
        <Copyright />
      </Container>
    </ThemeProvider>
  )
}

export default CheckoutPage
