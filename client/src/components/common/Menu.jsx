// ThreeDotMenu.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text,Image, Modal } from 'react-native';
import { list_icon } from '../../../assets/icon';
import { useNavigation } from '@react-navigation/native';

const Menu = ({ options }) => {
  const navigation = useNavigation()
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleOptionClick = (option) => {
    toggleMenu();
    navigation.navigate(option)
  };

  return (
  <>
    <View className='relative  z-10 '>
      <TouchableOpacity onPress={toggleMenu}>
      <Image source={list_icon} alt='menu-icon' className='w-6 h-6' />

      </TouchableOpacity>

      {menuVisible && (
        // <Modal>
        <View className='absolute top-8 bg-white items-start justify-center min-w-[100px] right-2 shadow-2xl shadow-neutral-800 w-[80px]  rounded-md h-atuo text-white'>
          {options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handleOptionClick(option.navigate)} className='rounded-md active:bg-neutral-200 py-1 px-4  w-full  '>
              <Text className='font-Cabin text-base text-neutral-500'>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>     
        
        
      )}
    </View>
    </>
   
  );
};

export default Menu;
