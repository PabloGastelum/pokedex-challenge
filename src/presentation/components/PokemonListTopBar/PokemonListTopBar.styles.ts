import { StyleSheet } from 'react-native';

export const TOP_BAR_CONTENT_HEIGHT = 44;

export const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: { height: TOP_BAR_CONTENT_HEIGHT, justifyContent: 'center' },
});
