import React, { useState, useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { connect } from "react-redux";

const uid = 1;
const helperID = "neSlzD2RIiOcLID1pCZJVrKQk4D3";

class ChatScreen extends React.Component {
  state = {
    messages: [],
    uid1: null,
    uid2: null,
  };

  componentDidMount = async () => {
    // store in state
    const uid = await auth().currentUser.uid;
    // id of helper
    this.setState({ uid2: helperID });
    if (auth().currentUser.isAnonymous) {
      // id of anonymous
      this.setState({ uid1: uid });
    } else {
      this.setState({ uid1: this.props.anonID });
    }

    const unsubscribe = firestore()
      .doc(`helpers/${this.state.uid2}/chats/${this.state.uid1}`)
      .onSnapshot((documentSnapshot) => {
        let data = documentSnapshot.data();
        if (data) {
          let messages = data.messages;
          messages.forEach(
            (message) => (message.createdAt = message.createdAt.toDate())
          );
          this.setState({ messages: messages.reverse() });
        }
      });

    this.setState({ unsubscribe });
  };

  componentWillUnmount = () => {
    const unsubscribe = this.state.unsubscribe;
    unsubscribe();
  };

  onSend = async (new_messages = []) => {
    await this.setState({
      messages: GiftedChat.append(this.state.messages, new_messages),
    });

    firestore()
      .doc(`helpers/${this.state.uid2}/chats/${this.state.uid1}`)
      .update({
        messages: firestore.FieldValue.arrayUnion(new_messages[0]),
      });
  };

  render() {
    const currentID = auth().currentUser.uid;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: currentID,
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  anonID: state.appData.anonID,
});

export default connect(mapStateToProps)(ChatScreen);
