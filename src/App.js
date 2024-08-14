import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import IndexScreen from './components/IndexScreen';
import Signup from './components/Signup';
import Login from './components/Login';
import PasswordResend from './components/PasswordResend';
import Dashboard from './components/Dashboard';
import JobWebView from './components/JobWebView';
import SetInterview from './components/SetInterview';
import Interview from './components/Interview';
import Logs from './components/Logs';
import Settings from './components/Settings';
import MemoWrite from './components/MemoWrite';
import Ranking from './components/Ranking';
import { AuthProvider } from './context/AuthContext';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

// AuthProvider를 모든 페이지 영역에서 제어하여 토큰 조작 가능하게 함 - 수정
const App = () => {
    return (
      <AuthProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Index">
                <Stack.Screen 
                  name="IndexScreen" 
                  component={IndexScreen}
                  options={{ headerShown: false }} />

                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{ headerShown: false }}  />

                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}  />

                <Stack.Screen
                  name="PasswordResend"
                  component={PasswordResend}
                  options={{ headerShown: false }}  />            
                
                <Stack.Screen
                  name="Dashboard"
                  component={Dashboard}
                  options={{ headerShown: false }}  />

                <Stack.Screen
                  name="Ranking"
                  component={Ranking}
                  options={{ headerShown: false }}  />

                <Stack.Screen
                  name="Logs"
                  component={Logs}
                  options={{ headerShown: false }}  />

                <Stack.Screen
                  name="MemoWrite"
                  component={MemoWrite}
                  options={{ headerShown: false }}  />

                <Stack.Screen
                  name="JobWebView"
                  component={JobWebView}
                  options={{ headerShown: false }}  />

                <Stack.Screen
                  name="SetInterview"
                  component={SetInterview}
                  options={{ headerShown: false }}  />  

                <Stack.Screen
                  name="Interview"
                  component={Interview}
                  options={{ headerShown: false }}  />  

                <Stack.Screen
                  name="Settings"
                  component={Settings}
                  options={{ headerShown: false }}  /> 

            </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;