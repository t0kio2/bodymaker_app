import { Text, TouchableOpacity, } from 'react-native'
import { Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome5'

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 60,
            paddingTop: 10
          }
        }}
      >
        <Tabs.Screen
          name='home'
          options={({ route }) => ({
            title: route.params?.title || 'Home',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <Icon name='home' size={20} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {}}
                className="mr-4"
              >
                <Text>hello</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {}}
                className="ml-4"
              >
                <Text>hello</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Tabs>
    </>
  )
}

export default TabLayout
