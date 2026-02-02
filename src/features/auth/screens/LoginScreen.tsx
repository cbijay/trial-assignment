import { LoginFormData, loginSchema } from '@/features/auth/schemas/authSchemas';
import { useAuthStore } from '@/features/auth/state/authStore';
import { ActionButton } from '@/shared/components/ActionButton';
import { AuthFooter } from '@/shared/components/AuthFooter';
import { AuthHeader } from '@/shared/components/AuthHeader';
import { FormInput } from '@/shared/components/FormInput';
import { ScreenAnimation } from '@/shared/components/ScreenAnimation';
import { commonStyles } from '@/shared/theme';
import { Formik } from 'formik';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const LoginScreen: React.FC = () => {
  const { signIn, isAuthenticating, error } = useAuthStore();

  const handleLogin = async (values: LoginFormData) => {
    await signIn(values.email, values.password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ScreenAnimation>
          <View style={styles.formContainer}>
            <AuthHeader
              title="Welcome Back"
              subtitle="Sign in to continue to trial assignment"
            />

            <Formik<LoginFormData>
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <>
                  <View style={styles.inputContainer}>
                    <FormInput
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder="Email address"
                      error={errors.email}
                      touched={touched.email}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />

                    <FormInput
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      placeholder="Password"
                      error={errors.password}
                      touched={touched.password}
                      secureTextEntry
                    />
                  </View>

                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.error}>{error}</Text>
                    </View>
                  )}

                  <ActionButton
                    title={isAuthenticating || isSubmitting ? 'Signing in...' : 'Sign In'}
                    onPress={() => handleSubmit()}
                    disabled={isAuthenticating || isSubmitting}
                    loading={isAuthenticating || isSubmitting}
                  />
                </>
              )}
            </Formik>

            <AuthFooter
              linkText="Don't have an account?"
              actionText="Sign Up"
              targetScreen="Signup"
            />
          </View>
        </ScreenAnimation>
      </ScrollView>
    </KeyboardAvoidingView >
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  formContainer: {
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});
