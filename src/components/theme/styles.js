import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Changed from 'center' to start content from the top
    alignItems: 'center',
    paddingVertical: 20, // Reduced vertical padding to move content up
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 20, // Reduced from 40 to 20 to move logo up
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
    padding: 15, // Restored original padding
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    marginVertical: 8, // Restored original margin
    width: '95%', // Restored original width to match input
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: '95%',
    height: 40,
    margin: 10,
    padding: 10,
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