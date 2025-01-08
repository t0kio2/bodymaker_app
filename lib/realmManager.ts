import Realm from 'realm'

const TrainingMenuSchema = {
  name: 'TrainingMenu', // スキーマ名 (テーブル名)
  properties: {
    id: 'int',
    title: 'string',
    video: 'string',
    thumbnail: 'string',
    schedule: 'Schedule',
    goal: 'string',
    createdAt: 'date',
  }
}

const ScheduleSchema = {
  name: 'Schedule',
  properties: {
    id: 'int',
    recurring: 'int[]',
    time: 'string',
  }
}

const NotificationSchema = {
  name: 'Notification',
  properties: {
    id: 'int',
    trainingMenuId: 'int',
  }
}

const config = {
  schema: [
    TrainingMenuSchema,
    ScheduleSchema,
    NotificationSchema
  ],
  schemaVersion: 1,
  migration: (oldRealm: any, newRealm: any) => {
    if (oldRealm.schemaVersion < 1) {
      // スキーマの変更がある際はここに処理を記述
    }
  }
}
const realm = new Realm(config)

export default realm