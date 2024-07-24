import {
  Alert,
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
import { Ionicons } from '@expo/vector-icons';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}
const LoginPage = () => {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [countryCode, setCountryCode] = useState('+90');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardOffset = Platform.OS === 'ios' ? 50 : 0;
  const onSignIn = async (type: SignInType) => {
    switch (type) {
      case SignInType.Phone:
        try {
          const full = `${countryCode}${phoneNumber}`;
          const { supportedFirstFactors } = await signIn!.create({
            identifier: full,
          });
          const firstPhoneFactor: any = supportedFirstFactors.find(
            (factor: any) => {
              return factor.strategy === 'phone_code';
            }
          );
          const { phoneNumberId } = firstPhoneFactor;
          await signIn!.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId,
          });
          router.push({
            pathname: '/verify/[phone]',
            params: { phone: full, signin: 'true' },
          });
        } catch (error) {
          if (isClerkAPIResponseError(error)) {
            Alert.alert('error', error.errors[0].message);
          }
        }
        break;
      case SignInType.Email:
        break;
      case SignInType.Google:
        // Authenticate with Google
        break;
      case SignInType.Apple:
        // Authenticate with Apple
        break;
      default:
        break;
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number associated with your account
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

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber.length == 10 ? styles.enabled : styles.disabled,
            { marginTop: 20, marginBottom: 50 },
          ]}
          onPress={() => onSignIn(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          ></View>
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          ></View>
        </View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}
          onPress={() => onSignIn(SignInType.Email)}
        >
          <Ionicons name="mail" size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
            Continue with email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}
          onPress={() => onSignIn(SignInType.Google)}
        >
          <Ionicons name="logo-google" size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}
          onPress={() => onSignIn(SignInType.Apple)}
        >
          <Ionicons name="logo-apple" size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

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
