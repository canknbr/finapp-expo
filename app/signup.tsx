import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';

const SignUpPage = () => {
  const router = useRouter();
  const { signUp, setActive } = useSignUp();

  const [countryCode, setCountryCode] = useState('+90');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardOffset = Platform.OS === 'ios' ? 50 : 0;

  const onSignUp = async () => {
    const full = `${countryCode}${phoneNumber}`;

    try {
      await signUp!.create({
        phoneNumber: full,
      })
      signUp!.preparePhoneNumberVerification()
      router.push({pathname:'/verify/[phone]',params:{phone: full}})
    } catch (error) {
      console.error(error,'signUp error')
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's Get Started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number.We will send you a confirmation code there
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country code"
            placeholderTextColor={Colors.gray}
            value={countryCode}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile number"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor={Colors.gray}
            maxLength={10}
          />
        </View>
        <Link href={'/login'} replace>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber.length == 10 ? styles.enabled : styles.disabled,
            { marginTop: 20, marginBottom: 50 },
          ]}
          onPress={onSignUp}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginVertical: 40,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
