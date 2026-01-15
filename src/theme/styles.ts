import { StyleSheet } from 'react-native';
import { getColor } from './colors';

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: getColor.background(),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Typography
  text: {
    fontSize: 16,
    color: getColor.text(),
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: getColor.text(),
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    color: getColor.text(),
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
  },
  link: {
    fontSize: 16,
    color: getColor.primary(),
  },

  // Cards
  card: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: getColor.shadow(),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Buttons
  button: {
    backgroundColor: getColor.white(),
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: '600',
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: getColor.text(),
  },

  // Lists
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
  },

  // Modals
  modalOverlay: {
    backgroundColor: getColor.overlay(),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: getColor.background(),
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
}); 