import { View, Text, TouchableOpacity, Alert, Platform, UIManager, LayoutAnimation } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Recurring from './Recurring'
import { TaskWithSchedule } from '@/types'
import { router } from 'expo-router'
import { formatDate } from '@/lib/utils'
import Entypo from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'
import Checkbox from 'expo-checkbox'
import { useTaskActions } from '@/hooks/useTaskActions'
import { useTaskStore } from '@/hooks/useTaskStore'

// LayoutAnimationの有効化
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface TaskCardProps {
  task: TaskWithSchedule
  editMode?: boolean
  onTaskDeleted?: () => void
  onTaskCompleted?: () => void
  date: string,
  readonly?: boolean
}

const TaskCard = ({
  task,
  editMode = false,
  onTaskDeleted = () => {},
  onTaskCompleted,
  date,
  readonly = false
}: TaskCardProps) => {
  const { completeTaskForDate, removeTask } = useTaskStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })
  // タスク完了の状態を管理するための state
  const [isChecked, setIsChecked] = useState(false)

  // task.task_log_idがある場合は完了済みと判断
  const isCompleted = !!task.task_log_id

  // 初回レンダリング時、もしくはtask.task_log_idが変わったらチェック状態を更新
  useEffect(() => {
    setIsChecked(!!task.task_log_id)
  }, [isCompleted])

  const showDialog = (e: any) => {
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

  const handleCheckboxChange = async (newValue: boolean) => {
    setIsChecked(newValue)
    if (newValue) {
      const taskScheduleId = task.task_schedule_id
      if (!taskScheduleId) {
        console.error('taskScheduleId is not found')
        return
      }
      const success = await completeTaskForDate(task.id, taskScheduleId, date)
      if (success) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        Alert.alert("タスク完了", "タスクを完了しました")
        if (onTaskCompleted) { 
          onTaskCompleted()
        }
      } else {
        Alert.alert("エラー", "タスクの完了に失敗しました")
      }
    }
  }

  return (
    <>
      <View className='flex-row items-center bg-white rounded-lg shadow-xs border border-gray-200 ml-2 mr-2 mb-2 p-3'>
        {/* チェックボックス部分：完了済みの場合はチェック済みかつ変更不可 */}
        {!readonly && (
          editMode ? (
            <Icon name='align-justify' size={20} color='#6C8BA7' className='mr-4' />
          ) : (
            <Checkbox
              value={isChecked}
              onValueChange={!isCompleted ? handleCheckboxChange : undefined}
              disabled={isCompleted}
              color={isChecked ? '#6C8BA7' : undefined}
              className='mr-4'
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#6C8BA7'
              }}
            />
          )
        )}

        {/* メイン情報 */}
        <View className='flex-1'>
          {/* タスクタイトルに完了済みの場合、取り消し線と色変更を適用 */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              className='text-lg font-medium'
              style={[
                { color: '#333333' },
                isCompleted && { textDecorationLine: 'line-through', color: '#999999' }
              ]}
            >
              {task.title}
            </Text>
            {isCompleted && (
              <Icon
                name="check-circle"
                size={20}
                color="#6C8BA7"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
          <Recurring schedule={task} />
          <Text className='text-sm text-[#555555] mt-1'>
            通知: {task.is_push_notification ? `${task.notification_offset || 60}分前` : 'オフ'}
          </Text>
        </View>

        {/* サブ情報 */}
        <View className='ml-auto mr-5 items-end'>
          <Text className='text-sm text-[#555555]'>継続率 {task.rate}%</Text>
          <Text className='text-sm text-[#555555]'>クリア {task.completedCount ?? '---'}回</Text>
          <Text className='text-sm text-[#555555]'>開始 {formatDate(task.created_at)}</Text>
        </View>

        {/* 編集モードの場合の3点リーダー */}
        {!readonly && editMode && (
          <TouchableOpacity
            className='absolute top-2 right-1 p-1'
            onPress={(e) => showDialog(e)}
          >
            <Entypo name='dots-three-vertical' size={18} color='#6C8BA7' />
          </TouchableOpacity>
        )}
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
