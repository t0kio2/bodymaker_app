import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Recurring from './Recurring'
import { Task } from '@/types'
import { router, useLocalSearchParams } from 'expo-router'
import { formatDate } from '@/lib/utils'
import Entypo from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'
import { deleteNotificationById } from '@/lib/pushNotification'

const TaskCard = ({ task }: any) => {
  const [taskOnModal, setTaskOnModal] = useState<Task | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })
  const params = useLocalSearchParams()
  
  useEffect(() => {

  }, [params?.updated])

  const showDialog = (e: any, task: Task) => {
    const { pageX, pageY } = e.nativeEvent
    setIconPosition({ x: pageX, y: pageY })
    setIsModalVisible(true)
    // モーダルで対象とするアイテムを保持
    setTaskOnModal(task)
  }

  const handleEdit = () => {
    setIsModalVisible(false)
    router.push(`/edit?id=${taskOnModal?.id}`)
  }
  const handleDelete = async () => {
    if (!taskOnModal) return
    Alert.alert(
      taskOnModal.title, // タイトル
      '削除してもよろしいですか？', // メッセージ
      [ // ボタン
        {
          text: 'キャンセル',
          style: 'cancel',
          onPress: () => setIsModalVisible(false)
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsModalVisible(false)
            deleteNotificationById(taskOnModal.id)
            // const updatedTasks = tasks.filter((task: any) => task.id !== taskOnModal.id)
            // try {
            //   const db = await openDatabaseAsync()
            //   await deleteTask(db, taskOnModal.id)
            //   setTasks(updatedTasks)
            //   Alert.alert('削除しました')
            // } catch (error) {
            //   throw new Error('Failed to delete task')
            // } finally {
            //   setIsModalVisible(false)
            // }
          }
        }
      ]
    )
  }

  return (
    <>
      <View className='flex-row items-center m-2 pb-2 border-b-[0.5px] border-b-gray-400'>
        {/* リオーダーアイコン */}
        <Icon
          name='align-justify'
          size={20}
          color='#161622'
          className='mr-6'
        />
        {/* メイン情報 */}
        <View className='w-[160px] h-full'>
          <View className='flex-1 justify-between'>
            <Text className='text-xl mt-2'>{task.title}</Text>
            {/* カレンダーアイコン */}
            <Recurring schedule={task.schedule} className='mr-1' />
          </View>
        </View>
        {/* サブ情報 */}
        <View className='ml-4'>
          <Text className='mt-1'>継続率 60%</Text>
          <Text className='mt-1'>クリアした回数 108回</Text>
          <Text className='mt-1'>開始日 {formatDate(task.createdAt)}</Text>
        </View>
        {/* 3点リーダー */}
        <TouchableOpacity
          className='flex-1 h-full absolute right-0 top-1'
          onPress={(e) => showDialog(e, task)}
        >
          <Entypo
            name='dots-three-vertical'
            size={20}
            color='#161622'
          />
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        backdropOpacity={0.1}
        animationInTiming={1} // アニメーション無効
        animationOutTiming={1} // アニメーション無効
        style={{
          margin: 0,
          position: "absolute",
          top: iconPosition.y - 20,
          left: iconPosition.x - 60, // ダイアログの横位置調整
        }}
        useNativeDriver={true} // チラつき防止
        hideModalContentWhileAnimating={true} // チラつき防止
      >
        <View className="bg-white p-2 rounded shadow-lg">
          <TouchableOpacity onPress={() => handleEdit()} className="mb-2">
            <Text className="text-blue-500 text-lg">編集</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete()}>
            <Text className="text-red-500 text-lg">削除</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

export default TaskCard