// 以下廃止予定
export const DAY_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土']


// 曜日をビットマスクで表現するための定数
// 各曜日に2^nのビットを割り当てる
export const DAY_OF_WEEK_BIT = {
  Sunday:    1 << 0, // 0000001 = 1
  Monday:    1 << 1, // 0000010 = 2
  Tuesday:   1 << 2, // 0000100 = 4
  Wednesday: 1 << 3, // 0001000 = 8
  Thursday:  1 << 4, // 0010000 = 16
  Friday:    1 << 5, // 0100000 = 32
  Saturday:  1 << 6, // 1000000 = 64
}
