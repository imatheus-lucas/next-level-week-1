import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './pages/home';
import Points from './pages/points'
import Details from './pages/details'

const AppStack = createStackNavigator()
const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator headerMode='none'
      screenOptions={{
        cardStyle:{
          backgroundColor:'#fff'
        }
      }}>
        <AppStack.Screen name="Home" component={Home}/>
        <AppStack.Screen name="Details" component={Details}/>
        <AppStack.Screen name="Points" component={Points}/>
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;