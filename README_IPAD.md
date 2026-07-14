# 小学生算数ナビ iPad対応メモ

## できること

iPadではAndroid APKを直接インストールできません。今回の対応では、iPad Safariで使いやすいPWAとして動かせるように、Web版のホーム画面追加、Safe Area、タッチ操作、オフライン再表示を整えています。

## iPadで使う手順

1. `npm.cmd run build` を実行します。
2. 生成された `dist/` をHTTPSで公開できる静的ホスティングへ配置します。サブフォルダ配信でも動きやすいよう、ビルドは相対パス出力にしています。
3. iPadのSafariで公開URLを開きます。
4. Safariの共有ボタンから「ホーム画面に追加」を選びます。
5. ホーム画面の「算数ナビ」アイコンから起動します。

## 注意

- Service WorkerはHTTPSまたはlocalhostで有効になります。`file://` 直開きでは使えません。
- AquesTalk TTSはAndroid向け外部TTS連携です。iPad Safariでは端末のWeb Speech API対応状況に応じて読み上げを使います。
- iPad向けのネイティブIPAを作る場合は、macOS、Xcode、Apple Developer設定が必要です。Windows環境だけではIPAの署名・実機配布は完了できません。

## ネイティブiPadアプリ化する場合の流れ

macOS環境で以下を行います。

```bash
npm install
npm run build
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
npx cap open ios
```

その後、XcodeでBundle Identifier、署名チーム、iPad対応設定を確認してビルドします。

## 今回追加したiPad向け要素

- `manifest.webmanifest`
- `apple-touch-icon`
- iOS Safari用メタタグ
- `viewport-fit=cover`
- `100dvh` と Safe Area 対応
- 本番ビルド時のみ登録されるService Worker
- iPad向けのタッチ操作・タブレット幅CSS
- サブフォルダ配信に対応しやすいVite相対パス出力
