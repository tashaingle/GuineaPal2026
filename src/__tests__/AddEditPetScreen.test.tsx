import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render } from '@testing-library/react-native';
import React from 'react';
import AddEditPetScreen from '../screens/AddEditPetScreen';

const Stack = createNativeStackNavigator();

function TestScreen() {
  return <AddEditPetScreen />;
}

describe('AddEditPetScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByText('Add Pet')).toBeTruthy();
  });
}); 