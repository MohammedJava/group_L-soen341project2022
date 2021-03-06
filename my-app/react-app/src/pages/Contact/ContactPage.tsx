import { Button, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import {
  store,
  useAppDispatch,
  useAppSelector,
} from '../../store/configureStore'
import { fetchProductsAsync } from '../Products/catalogSlice'
import { decrement, increment } from './counterSlice'

const ContactPage = () => {
  const dispatch = useAppDispatch()
  const { data, title } = useAppSelector((state) => state.counter)
  store.dispatch(fetchProductsAsync())

  return (
    <>
      <Typography variant="h1">contact</Typography>
      {/*<Button
        onClick={() => dispatch(decrement(1))}
        variant="contained"
        color="error"
      >
        Decrement
      </Button>
      <Typography variant="h5">{data}</Typography>
      <Button
        onClick={() => dispatch(increment(1))}
        variant="contained"
        color="error"
      >
        Increment
  </Button>*/}
    </>
  )
}

export default ContactPage
