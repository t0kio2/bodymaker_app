import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Recurring from './Recurring'
import { Task, TaskWithSchedule } from '@/types'
import { router } from 'expo-router'
import { formatDate } from '@/lib/utils'
import Entypo from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'
import Checkbox from 'expo-checkbox'
import { useTask } from '@/hooks/useTask'

const TaskCard = ({ task, editMode = false, onTaskDeleted }:{
  task: TaskWithSchedule
  editMode?: boolean
  onTaskDeleted: () => void
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })
  const [isChecked, setIsChecked] = useState(false)
  const { removeTask } = useTask(task.id as string)
  

  const showDialog = (e: any, task: Task) => {
    const { pageX, pageY } = e.nativeEvent
    setIconPosition({ x: pageX, y: pageY })
    setIsModalVisible(true)
  }

  const handleEdit = () => {
    setIsModalVisible(false)
    router.push(`/taskForm?mode=edit&id=${task.id}`)
  }
  const handleDelete = async () => {
    Alert.alert(
      task.title,
      '削除してもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
          onPress: () => setIsModalVisible(false)
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsModalVisible(false)
            await removeTask(task.id)
            onTaskDeleted()
          }
        }
      ]
    )
  }

  return (
    <>
      <View className='flex-row items-center m-2 pb-2 border-b-[0.5px] border-b-gray-400'>
        {
          editMode ? (
            <Icon
              name='align-justify'
              size={20}
              color='#161622'
              className='mr-6'
            />
          ):(
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? '#7bc96f' : undefined}
              className='mr-4'
              style={{ 
                width: 25, // サイズ調整
                height: 25,
                borderRadius: 15, // 円形にする
                borderWidth: 1, // 枠線を表示
              }}
            />
          )
        }
        {/* メイン情報 */}
        <View className='w-[160px] h-full'>
          <View className='flex-1 justify-between'>
            <Text className='text-xl mt-2'>{task.title}</Text>
            {/* カレンダーアイコン */}
            <Recurring schedule={task} />
          </View>
        </View>
        {/* サブ情報 */}
        <View className='ml-4'>
          <Text className='mt-1'>継続率 60%</Text>
          <Text className='mt-1'>クリアした回数 108回</Text>
          <Text className='mt-1'>開始日 {formatDate(task.created_at)}</Text>
        </View>
        {/* 3点リーダー */}
        {
          editMode && (
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
          )
        }
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