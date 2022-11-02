import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";

import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

const AppContainer = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					title: "Teen Anonymous",
				}}
			>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={({ navigation }) => ({
						headerRight: () => (
							<TouchableOpacity
								onPress={() => navigation.navigate("Login")}
							>
								<Text>Login</Text>
							</TouchableOpacity>
						),
					})}
				/>
				<Stack.Screen name="Chat" component={ChatScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppContainer;
