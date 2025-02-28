// データベース初期化処理をまとめたカスタムフック

import { DatabaseContext } from "@/context/DatabaseProvider"
import { useContext,  } from "react"

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}