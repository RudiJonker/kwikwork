import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16, // Maintain horizontal padding for content
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: theme.sizes.large,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    marginVertical: 8,
    width: '95%', // Keep button width as is for design consistency
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: '100%', // Full width to fit the screen
    height: 40,
    marginVertical: 5, // Vertical margin for spacing
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: 4,
    fontFamily: theme.fonts.family,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.borderDefault,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  link: {
    color: theme.colors.accent,
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});