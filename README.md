# 拡張性高いRAGシステム

拡張性の高いRetrieval Augmented Generation (RAG)システムのテンプレートリポジトリです。

## 概要

このプロジェクトは、様々なドキュメント形式に対応し、柔軟なカスタマイズが可能なRAG機能を提供することを目的としています。エンタープライズ向けの堅牢なドキュメント検索と生成AI機能を組み合わせたシステムの開発基盤となります。

主な機能：
- 多様なドキュメント形式（PDF、Word、テキストなど）のインデックス化
- セマンティック検索とハイブリッド検索
- 複数のLLMプロバイダー対応
- スケーラブルなアーキテクチャ
- プラグイン拡張性

## 技術スタック

- **フロントエンド**: Next.js 14+, React 18+, TailwindCSS
- **バックエンド**: FastAPI (予定)
- **データベース**: PostgreSQL, Elasticsearch (予定)
- **検索**: Elasticsearch (ベクトル検索機能)
- **LLM**: OpenAI, Anthropic, Mistral AI など

## 開発環境のセットアップ

### 前提条件

- Docker と Docker Compose がインストールされていること
- Node.js 18+ (ローカル開発の場合)
- npm または yarn (ローカル開発の場合)

### Dockerを使った開発環境の構築

1. リポジトリをクローン：
```bash
git clone https://github.com/takuyakubo/extensible-rag-template.git
cd extensible-rag-template
```

2. Docker Composeで環境を起動：
```bash
docker-compose up --build
```

3. ブラウザでアクセス：
   - フロントエンド: http://localhost:3000
   - モックAPI: http://localhost:3001
   - Elasticsearch: http://localhost:9200

### ローカル開発 (Docker不使用)

フロントエンドのみをローカルで開発する場合：

```bash
cd frontend
npm install
npm run dev
```

## ディレクトリ構造

```
extensible-rag-template/
├── docker-compose.yml      # Docker設定
├── frontend/               # Next.js フロントエンド
│   ├── src/                # ソースコード
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # Reactコンポーネント
│   │   └── lib/           # ユーティリティと型定義
├── mock-api/               # 開発用モックAPI
└── documents/              # プロジェクト設計ドキュメント
```

## 主な機能

### 現在実装済み

- **フロントエンドの基本構造**
  - ダッシュボードレイアウト
  - ナビゲーション
  - チャットインターフェース
  - ドキュメント管理画面（モック）
  - ユーザー管理画面（モック）
  - 設定画面（モック）

### 今後の実装予定

- **バックエンド API**
  - ドキュメント処理パイプライン
  - ベクトル検索インテグレーション
  - LLM統合
  - ユーザー認証

- **拡張機能**
  - カスタムプラグインサポート
  - 高度な検索機能
  - ドキュメント処理の最適化

## テスト

フロントエンドのテストを実行：

```bash
cd frontend
npm test
```

## 使用方法

### フロントエンドの操作

1. ホームページ (`/`) からチャットを開始またはログイン
2. ダッシュボード (`/dashboard`) で各種機能にアクセス:
   - チャット (`/dashboard/chat`): AIとのチャット
   - ドキュメント管理 (`/dashboard/documents`): ドキュメントのアップロードと管理
   - ユーザー管理 (`/dashboard/admin/users`): ユーザーとロールの管理 (管理者のみ)
   - 設定 (`/dashboard/settings`): システム設定の構成

### デモユーザーアカウント (モック)

- 管理者: admin@example.com / password
- 一般ユーザー: user@example.com / password

## 設計ドキュメント

詳細な要件やシステム設計については、[ドキュメントフォルダ](./documents/)を参照してください。

- [要件定義書](./documents/requirements.md)
- [アーキテクチャ設計書](./documents/architecture.md)
- [コンポーネント詳細設計](./documents/architecture/components.md)
- [拡張アーキテクチャ](./documents/architecture/extension.md)

## 貢献方法

1. このリポジトリをフォーク
2. 機能追加やバグ修正のためのブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。