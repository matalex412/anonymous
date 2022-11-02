import React, { useState, useCallback, useEffect } from "react";
import { Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";

const uid = 1;
const helperID = "neSlzD2RIiOcLID1pCZJVrKQk4D3";

// if anonymous user then ..
export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .doc(`helpers/${helperID}/chats/${uid}`)
      .onSnapshot((documentSnapshot) => {
        let data = documentSnapshot.data();
        let messages = data.messages;
        messages.forEach(
          (message) => (message.createdAt = message.createdAt.toDate())
        );
        setMessages(messages.reverse());
      });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (new_messages = []) => {
    await setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, new_messages)
    );
    firestore()
      .doc(`helpers/${helperID}/chats/${uid}`)
      .update({
        messages: firestore.FieldValue.arrayUnion(new_messages[0]),
      });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: uid,
      }}
    />
  );
}
