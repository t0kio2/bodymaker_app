import { View, Text, TextInput } from 'react-native'
import React from 'react'

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  containerStyle
}: any) => {
  return (
    <View className={`space-y-2 ${containerStyle}`}>
      <Text>{ title }</Text>
      <View className='mt-1 w-full h-16 px-4 rounded-2xl bg-[#D9D9D9]
      flex flex-row items-center'>
        <TextInput
          className='flex-1 font-psemibold text-base'
          // style={{ backgroundColor: '#D9D9D9' }}
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
        />
      </View>
    </View>
  )
}

export default FormField