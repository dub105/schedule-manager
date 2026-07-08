# iOS ネイティブアプリのビルド手順

## 必要なもの
- Mac (macOS 13 以上推奨)
- Xcode 15 以上（App Store から無料インストール）
- Apple ID（無料。App Store 配布には Developer Program 年額 $99 が別途必要）
- Node.js 18 以上

## 初回セットアップ（Mac で実行）

```bash
# 1. リポジトリをクローン
git clone https://github.com/dub105/schedule-manager.git
cd schedule-manager
git checkout claude/schedule-belongings-tracker-tnm48u

# 2. 依存関係をインストール
npm install

# 3. iOS プラットフォームを追加（初回のみ）
npx cap add ios

# 4. ビルド → iOS プロジェクトに同期 → Xcode を開く
npm run cap:ios
```

## 通常の開発フロー（2回目以降）

```bash
# コードを変更したら
npm run cap:sync    # ビルド + Xcode プロジェクトに同期
npx cap open ios    # Xcode を開く
```

## Xcode でのビルド手順

1. Xcode が開いたら左上の **▶ Run** ボタンをクリック
2. 初回は「Signing & Capabilities」でチームを自分の Apple ID に設定
3. シミュレーター or 実機を選択して実行

## 実機への直接インストール（無料）

Apple Developer Program に未加入でも、自分の iPhone/iPad に直接インストールできます。

1. iPhone を Mac に USB 接続
2. Xcode の Targets → スキームで実機を選択
3. ▶ Run を押す
4. iPhone の「設定 → 一般 → VPN とデバイス管理」で開発者を信頼

## 朝の通知について

アプリを起動後、サイドバー下部の「朝の通知を設定」ボタンをタップすると
毎朝 5:30 に「今日の予定を確認しましょう」という通知が届くようになります。
アプリが閉じていても通知されます。
