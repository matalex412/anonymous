import React, { useState, useCallback, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import auth from "@react-native-firebase/auth";

const HomeScreen = ({ navigation }) => {
	const chat = async () => {
		await auth().signInAnonymously();
		navigation.navigate("Chat");
	};

	return (
		<View>
			<TouchableOpacity onPress={() => chat()}>
				<Text>Chat with a helper</Text>
			</TouchableOpacity>
		</View>
	);
};

export default HomeScreen;
