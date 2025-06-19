import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { auth } from './config/firebaseConfig'; // Import your Firebase configuration

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '1017529723910-atu626se8d9s1sjjtg4a9onpkigogk5m.apps.googleusercontent.com', // Your Web Client ID
});

const GoogleLoginScreen = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Function to handle Google sign-in
  const signInWithGoogle = async () => {
    try {
      // Step 1: Get the Google Sign-In user details
      const { idToken } = await GoogleSignin.signIn();

      // Step 2: Create a Google credential with the idToken
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Step 3: Sign in with Firebase using the Google credential
      const userCredential = await signInWithCredential(auth, googleCredential);

      // Step 4: Get user details from Firebase
      setUser(userCredential.user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  // Function to handle sign-out
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign-out Error:', error);
    }
  };

  return (
    <View style={{ marginTop: 50, paddingHorizontal: 20 }}>
      {user ? (
        <View>
          <Text>Welcome, {user.displayName}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      ) : (
        <Button title="Sign in with Google" onPress={signInWithGoogle} />
      )}
    </View>
  );
};

export default GoogleLoginScreen;
