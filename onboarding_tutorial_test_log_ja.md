# 小学生算数ナビ 初回オンボーディング テストログ

実施日: 2026-07-14

## 自動テスト

実行: `npm test`

- Test Files: 22 passed / 22
- Tests: 122 passed / 122
- 新規オンボーディング判定テストを含む
- 既存の問題生成、学習支援、スタンプ、PWA、Android設定テストを含む

## production build

実行: `npm run build`

- TypeScript build: 成功
- Vite production build: 成功
- 103 modules transformed
- 出力JS: `dist/assets/index-BENQ05rB.js`
- 出力CSS: `dist/assets/index-Bryt0ViO.css`
- 既知の警告: メインJSが500kBを超えるViteのサイズ警告。ビルド失敗ではなく、今回の機能動作には影響なし

## チュートリアルUI自動確認

実行: `node scripts/check-onboarding-ui.mjs`

### 初回画面

- 表示: 1 / 10
- 見出し: こんにちは！
- 先生画像読込: 成功
- 390px viewport: scrollWidth 390px、横はみ出しなし
- 最小ボタン高: 46px

### 初期設定

- 学年ボタン: 6個
- ニックネーム欄: 表示
- 文字サイズ設定: 表示
- 戻る・次へ: 動作

### 練習問題

- 不正解: 「おしい！」を表示して再回答可能
- 正解: 「せいかい！」を表示
- 正解前は次へ進めない
- 正解後は次へ進める
- 390pxで横はみ出しなし
- 1280pxタブレット相当で横はみ出しなし
- 練習前後で通常進捗データが変わらない

### 完了・再起動・再表示・スキップ

- 完了後: チュートリアルが閉じる
- `onboardingCompleted`: true
- `onboardingVersion`: 2
- 通常回答履歴: 0件
- 通常挑戦回数: 0回
- 2回目起動: 自動表示されない
- 設定「使い方をもう一度見る」: 再表示成功
- スキップ確認後: 完了状態を保存して閉じる

### スクリーンショット

- `.artifacts/onboarding/onboarding-practice-mobile.png`
- `.artifacts/onboarding/onboarding-practice-tablet.png`

## Android

実行: `npm run android:build:release`

- Vite production build: 成功
- Capacitor `sync android`: 成功
- 最新distを `android/app/src/main/assets/public` へコピー: 成功
- Gradle `assembleRelease`: 成功
- 203 actionable tasks: 40 executed、163 up-to-date
- packageName: `com.futari.mathstudy`
- versionCode / versionName: 32 / 1.2.6
- minSdk / targetSdk: 24 / 36
- `allowBackup=false`: 維持
- INTERNET権限: Manifestに追加なし

配布用APKをzipalign後、既存の正式keystoreで署名し、デスクトップへ出力しました。

- APK: `shogakusei_sansu_navi_v1.2.6_code32_onboarding_tutorial_release_signed.apk`
- APK Signature Scheme v2: true
- APK Signature Scheme v3: true
- 署名者: `CN=Shogakusei Sansu Navi, OU=Pencilmania, O=Pencilmania, C=JP`
- 証明書SHA-256: `38A88FB575906BB54EE0D305C8A5CAEBA0A287E850D9F4FB4B9E295595C02378`
- APK SHA-256: `9519051BD35DD73A69EF4057AF965B574CF83E70E3FCAF6B86B9DDC6B6E10407`
- packageName: `com.futari.mathstudy`
- INTERNET権限: なし
- `allowBackup=false`: 維持
- `debuggable`: 未設定

## PWA

- manifest `start_url`: `./`
- manifest `scope`: `./`
- Service Workerキャッシュ: `v6`
- Service Worker登録構造: 既存の1か所を維持
- 新規外部URL・新規画像: なし
- APP_SHELL関連テスト: 成功
- PWA ZIP: `shogakusei_sansu_navi_ipad_pwa_onboarding_tutorial_v1.2.6_20260714.zip`
- ZIPエントリ数: 15
- Android APK/AAB/idsig混入: 0件
- 不正なバックスラッシュ区切り: 0件
- PWA ZIP SHA-256は、報告書を同梱した最終ZIP生成後に外部検証して記録する

## 実機未確認

- Android実機の物理戻るボタンと端末TTS
- iPad PWA縦横・文字サイズ最大・完全オフライン再起動
- AquesTalk対応端末での音声停止タイミング
