import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";
import auth from "@react-native-firebase/auth";

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
						headerRight: () => {
							var loggedIn = false;
							if (auth().currentUser) {
								if (!auth().currentUser.isAnonymous) {
									loggedIn = true;
								}
							}
							return !loggedIn ? (
								<TouchableOpacity
									onPress={() => navigation.navigate("Login")}
								>
									<Text>Login</Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									onPress={() => {
										loggedIn = false;
										auth().signOut();
									}}
								>
									<Text>Logout</Text>
								</TouchableOpacity>
							);
						},
					})}
				/>
				<Stack.Screen
					options={{ title: "" }}
					name="Chat"
					component={ChatScreen}
				/>
				<Stack.Screen
					options={{ title: "Login" }}
					name="Login"
					component={LoginScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppContainer;
