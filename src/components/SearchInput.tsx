import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { ITheme } from '../interface';
import { useTheme } from '../themes/ThemeContext';
import SearchIcon from '../assets/images/search_icon';
import { CloseIcon } from '../assets';

const SearchInput = ({
  onSearch,
}: {
  onSearch?: (text: string) => void;
}) => {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  const [text, setText] = useState('');
  const handleSearch = (text: string) => {
    setText(text);
    onSearch?.(text);
  };
  const handleClear = () => {
    setText('');
    onSearch?.('');
  };
  return (
    <View style={styles.container}>
      <SearchIcon width={20} height={20} fill={theme.textPrimary} />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#fff"
        style={styles.searchInput}
        value={text}
        onChangeText={handleSearch}
      />
      {text.length > 0 && (
        <Pressable onPress={handleClear}>
          <CloseIcon width={20} height={20} fill={theme.textPrimary} />
        </Pressable>
      )}
    </View>
  );
};

const styleSheet = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      //   justifyContent: 'center',
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
      paddingHorizontal: 10,
      color: theme.textPrimary,
    },
  });

export default SearchInput;
