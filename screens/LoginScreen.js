import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { material, systemWeights } from "react-native-typography";
import auth from "@react-native-firebase/auth";

import { store } from "./../redux/store";
import { updateTopics } from "./../redux/actions";

export default class LoginScreen extends React.Component {
	state = {
		email: "",
		password: "",
		errorMessage: null,
		isLoading: false,
		isPasswordHidden: true,
	};

	handleLogin = async () => {
		this.setState({ isLoading: true });
		this.setState({ errorMessage: null });
		if (this.state.email.length > 1 && this.state.password.length > 1) {
			// sign user in
			try {
				await auth().signInWithEmailAndPassword(
					this.state.email,
					this.state.password
				);

				// await store.dispatch(updateTopics({ loggedIn: true }));
				this.props.navigation.navigate("Chat");
			} catch (error) {
				// create error message
				var message;
				switch (error.code) {
					case "auth/invalid-email":
						message =
							"That doesn't seem like a valid email address";
						break;
					case "auth/user-disabled":
						message = "This account has been disabled";
						break;
					case "auth/user-not-found":
						message =
							"Sorry, the account for that email doesn't exist";
						break;
					case "auth/wrong-password":
						message = "Sorry, you've entered the wrong password";
						break;
					case "auth/too-many-requests":
						message = "Too many tries to login. Try again later";
					default:
						message = "Sorry, something went wrong";
				}

				console.log(error);
				// display errors
				this.setState({ errorMessage: message });
			}
		} else {
			setTimeout(() => {
				this.setState({
					errorMessage:
						"Please fill in the email and password fields",
				});
			}, 500);
		}
		this.setState({ isLoading: false });
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Admin Login</Text>
				<View style={styles.subContainer}>
					<View style={styles.row}>
						<MaterialCommunityIcons
							name="email"
							size={25}
							color="#307991"
						/>
						<TextInput
							style={styles.textInput}
							keyboardType="email-address"
							autoCapitalize="none"
							placeholder="Email"
							onChangeText={(email) => this.setState({ email })}
							value={this.state.email}
						/>
					</View>
					<View style={styles.row}>
						<MaterialCommunityIcons
							name="lock"
							size={25}
							color="#307991"
						/>
						<TextInput
							secureTextEntry={this.state.isPasswordHidden}
							style={styles.textInput}
							autoCapitalize="none"
							placeholder="Password"
							onChangeText={(password) =>
								this.setState({ password })
							}
							value={this.state.password}
						/>
						<TouchableOpacity
							style={{ position: "absolute", right: 5 }}
							onPress={() =>
								this.setState({
									isPasswordHidden:
										!this.state.isPasswordHidden,
								})
							}
						>
							<MaterialCommunityIcons
								name={
									this.state.isPasswordHidden
										? "eye"
										: "eye-off"
								}
								size={25}
								color="#307991"
							/>
						</TouchableOpacity>
					</View>
					{!this.state.isLoading ? (
						<TouchableOpacity
							style={styles.submitButton}
							onPress={this.handleLogin}
						>
							<Text style={material.subheadingWhite}>Login</Text>
						</TouchableOpacity>
					) : (
						<View style={styles.submitButton}>
							<ActivityIndicator color="#000" />
						</View>
					)}
				</View>
				{this.state.errorMessage ? (
					<Text
						style={[
							material.subheading,
							{
								padding: 5,
								color: "#e3242b",
								...systemWeights.bold,
							},
						]}
					>
						{this.state.errorMessage}
					</Text>
				) : (
					<Text
						style={[
							material.subheading,
							{ padding: 5, ...systemWeights.bold },
						]}
					>
						{"  "}
					</Text>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	subContainer: {
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 20,
		width: "80%",
		borderRadius: 5,
		elevation: 3,
	},
	title: {
		...material.title,
		...systemWeights.bold,
		marginBottom: 5,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	textInput: {
		padding: 2,
		width: "80%",
		marginLeft: 5,
		borderBottomWidth: 1,
	},
	submitButton: {
		height: 28,
		justifyContent: "center",
		alignItems: "center",
		width: "90%",
		marginTop: 10,
		borderRadius: 2,
		elevation: 1,
		backgroundColor: "#307991",
	},
});
