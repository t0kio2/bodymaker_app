import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({
  title,
  handlePress,
  containerStyle,
  textStyle,
  isLoading
}: any) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`
        bg-white
        border
        border-gray-300
        rounded-xl
        min-h-[52px]
        justify-center
        items-center
        flex
        flex-row
        shadow-sm
        ${containerStyle}
        ${isLoading ? 'opacity-50' : ''}
      `}
      disabled={isLoading}
    >
      <Text className={`${textStyle} text-gray-800 text-lg font-medium`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton