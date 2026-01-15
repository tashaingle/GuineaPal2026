import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { getColor } from './colors';
import { typography } from './typography';

type Style = ViewStyle | TextStyle;
type StyleMap = { [key: string]: Style };

export const commonStyles = StyleSheet.create({
  // Screen containers - match welcome screen
  screenContainer: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  } as ViewStyle,
  contentContainer: {
    flex: 1,
    padding: 12,
  } as ViewStyle,

  // Headers - match welcome screen header style
  header: {
    backgroundColor: getColor.white(),
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center',
  } as TextStyle,

  // Cards - match welcome screen card style
  card: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  } as TextStyle,
  cardContent: {
    fontSize: 16,
    color: getColor.textSecondary(),
  } as TextStyle,

  // Buttons - match welcome screen button style
  button: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
  } as TextStyle,
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: getColor.border(),
  } as ViewStyle,
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
  } as TextStyle,

  // Form inputs - match welcome screen style
  input: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: getColor.text(),
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  } as TextStyle,

  // Lists
  listItem: {
    backgroundColor: getColor.white(),
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  } as ViewStyle,

  // Modals
  modalOverlay: {
    backgroundColor: getColor.overlay(),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalContent: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 3,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  } as ViewStyle,

  // Grid layout (like welcome screen)
  row: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  } as ViewStyle,
  gridItem: {
    flex: 1,
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  gridItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center',
  } as TextStyle,

  // Status indicators
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  } as ViewStyle,
  badgeText: {
    ...typography.textStyles.caption,
    color: getColor.background(),
  } as TextStyle,

  // Utility styles
  spaceBetween: {
    justifyContent: 'space-between',
  } as ViewStyle,
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  mt8: { marginTop: 8 } as ViewStyle,
  mt16: { marginTop: 16 } as ViewStyle,
  mb8: { marginBottom: 8 } as ViewStyle,
  mb16: { marginBottom: 16 } as ViewStyle,
  mx16: { marginHorizontal: 16 } as ViewStyle,
  my16: { marginVertical: 16 } as ViewStyle,
  p16: { padding: 16 } as ViewStyle,
} as StyleMap);

export default commonStyles; 