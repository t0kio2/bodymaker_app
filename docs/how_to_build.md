# Android
#### apk生成
```
eas build -p android --profile production

```
production設定は以下
```
"production": {
  "autoIncrement": true,
  "android": {
    "buildType": "apk"
  }
```

20250302 以前はビルドエラーになった気がするが、成功した。