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
        bg-primary
        rounded-xl
        h-[100px]
        min-h-[62px]
        justify-center
        items-center
        flex
        flex-row
        ${containerStyle}
        ${isLoading ? 'opacity-50' : ''}
      `}
      disabled={isLoading}
    >
      <Text className={`${textStyle} text-white text-lg`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton