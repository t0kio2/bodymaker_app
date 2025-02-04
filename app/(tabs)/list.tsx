import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { router, useLocalSearchParams } from 'expo-router'
import { Item } from '@/types'
import { getItems } from '@/database/queries'
import { openDatabaseAsync } from '@/database/db'
import ItemCard from '@/components/ItemCard'

export default function List() {
  const [items, setItems] = useState<Item[]>([])
  const params = useLocalSearchParams()

  useEffect(() => {
    loadData()
  }, [params?.updated])

  const loadData = async () => {
    try {
      const db = await openDatabaseAsync()
      const items = await getItems(db)
      if (items !== null) {
        setItems(items)
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to load data')
    }
  }

  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaView className='h-full'>
      <FlatList
        // className='border border-red-500'
        data={ items }
        keyExtractor={ item => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
          />
        )}
        // ListHeaderComponent={<Text>Header</Text>}
        ListEmptyComponent={<Text>習慣が登録されていません。登録しましょう！</Text>}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
      />
      <TouchableOpacity
        className='absolute bottom-8 right-8 shadow-lg w-20 h-20 bg-[#161622] rounded-full
        flex items-center justify-center'
        onPress={() => router.push('/create')}
      >
        <Icon name='plus' size={20} color='#FFF' />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
