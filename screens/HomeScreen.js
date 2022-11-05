import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { updateAppData } from "./../redux/actions";
import { store } from "./../redux/store";

const helperID = "neSlzD2RIiOcLID1pCZJVrKQk4D3";
const HomeScreen = ({ navigation }) => {
	const [isHelper, setIsHelper] = useState(false);
	const [chats, setChats] = useState([]);

	const chat = async () => {
		if (!auth().currentUser) {
			await auth().signInAnonymously();
		}
		const uid = await auth().currentUser.uid;
		await firestore()
			.collection(`helpers/${helperID}/chats`)
			.doc(uid)
			.set({ messages: [] });

		firestore()
			.collection("helpers")
			.doc(helperID)
			.update({ conversations: firestore.FieldValue.arrayUnion(uid) });
		navigation.navigate("Chat");
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(() => getChats());
		return subscriber;
	}, []);

	const getChats = async () => {
		if (auth().currentUser) {
			if (!auth().currentUser.isAnonymous) {
				setIsHelper(true);
				uid = auth().currentUser.uid;
				const doc = await firestore()
					.collection("helpers")
					.doc(uid)
					.get();
				const data = doc.data();

				setChats(data.conversations);
			}
		} else {
			setIsHelper(false);
		}
	};

	const onChatClicked = async (uid) => {
		await store.dispatch(updateAppData({ anonID: uid }));
		navigation.navigate("Chat");
	};

	return (
		<View style={styles.container}>
			{!isHelper ? (
				<TouchableOpacity style={styles.button} onPress={() => chat()}>
					<Text style={styles.text}>Chat with a helper</Text>
				</TouchableOpacity>
			) : chats.length > 0 ? (
				chats.map((uid, id) => {
					return (
						<TouchableOpacity
							style={styles.button}
							onPress={() => onChatClicked(uid)}
							key={id}
						>
							<Text style={styles.text}>
								Chat with Person {id}
							</Text>
						</TouchableOpacity>
					);
				})
			) : (
				<Text>No chats</Text>
			)}
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 25,
	},
	button: {
		elevation: 1,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 10,
	},
});
