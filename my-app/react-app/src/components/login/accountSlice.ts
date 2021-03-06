/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import agent from '../../ApiCall/agent'
import { history } from '../../App'
import { User } from '../../models/User'
import { setCart } from '../Shopping/cartSlice'

interface AccountState {
  user: User | null
}

const initialState: AccountState = {
  user: null,
}

export const signInUser = createAsyncThunk<User, FieldValues>(
  'account/signInUser',
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data)
      const { cart, ...user } = userDto
      if (cart) thunkAPI.dispatch(setCart(cart))
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
)

export const fetchCurrentUser = createAsyncThunk<User>(
  'account/fetchCurrentUser',
  async (_, thunkAPI) => {
    // eslint-disable-next-line no-use-before-define
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
    try {
      const userDto = await agent.Account.currentUser()
      const { cart, ...user } = userDto
      if (cart) thunkAPI.dispatch(setCart(cart))
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error: any) {
      console.log('fetch user error', error)
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null
      localStorage.removeItem('user')
      history.push('/')
    },
    setUser: (state, action) => {
      const claims = JSON.parse(atob(action.payload.token.split('.')[1]))
      const roles =
        claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      state.user = {
        ...action.payload,
        roles: typeof roles === 'string' ? [roles] : roles,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        const claims = JSON.parse(atob(action.payload.token.split('.')[1]))
        const roles =
          claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        state.user = {
          ...action.payload,
          roles: typeof roles === 'string' ? [roles] : roles,
        }
      }
    )
    builder.addMatcher(
      isAnyOf(signInUser.rejected, fetchCurrentUser.rejected),
      (state, action) => {
        console.log(action)
      }
    )
  },
})

export const { signOut, setUser } = accountSlice.actions
