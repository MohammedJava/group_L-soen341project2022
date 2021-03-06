import { Paper, Tabs, Box, Tab } from '@mui/material'
import React from 'react'
import Login from '../components/login/login'
import Signup from '../components/login/signup'
import TabPanel from '../misc/TabPanel'

interface IProps {
  stateChanger: (state: boolean) => void
  initialState: number
}

const SignInOutContainer: React.FC<IProps> = (props) => {
  const [value, setValue] = React.useState(props.initialState)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Paper elevation={20} style={{ width: 330, margin: '20px auto' }}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
        variant="fullWidth"
      >
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Box>
          <Login stateChanger={props.stateChanger} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box>
          <Signup emailProp="" password="" />
        </Box>
      </TabPanel>
    </Paper>
  )
}

export default SignInOutContainer
