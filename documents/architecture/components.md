# コンポーネント詳細設計

## 2.1 フロントエンド（Next.js）

フロントエンドアプリケーションは、Next.jsフレームワークを使用したSPA（Single Page Application）として実装されます。

**主要コンポーネント:**
1. **チャットインターフェース** - ユーザーとRAGシステムのインタラクション
2. **ドキュメント管理ダッシュボード** - ドキュメントのアップロードと管理
3. **管理コンソール** - システム設定と監視
4. **ユーザー管理インターフェース** - ユーザーとロールの管理

**技術スタック:**
- Next.js 14+（App Routerアーキテクチャ）
- React 18+
- TailwindCSS（スタイリング）
- Zustand（状態管理）
- React Query（APIデータフェッチング）
- Shadcn UI（UIコンポーネントライブラリ）

**フロントエンドディレクトリ構造:**
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   ├── documents/
│   │   └── settings/
│   ├── chat/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── chat/
│   ├── documents/
│   └── admin/
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
├── hooks/
├── providers/
└── public/
```

## 2.2 APIゲートウェイ（FastAPI）

APIゲートウェイは、すべてのクライアントリクエストの単一エントリポイントとして機能し、適切なマイクロサービスにルーティングします。

**主要機能:**
1. リクエストのルーティング
2. 認証と認可の検証
3. レート制限
4. リクエスト/レスポンスの変換
5. API文書化（Swagger/OpenAPI）

**エンドポイント:**
- `/api/auth/*` - 認証関連エンドポイント
- `/api/users/*` - ユーザー管理エンドポイント
- `/api/documents/*` - ドキュメント管理エンドポイント
- `/api/chat/*` - チャットと質問応答エンドポイント
- `/api/admin/*` - 管理者用エンドポイント

**技術スタック:**
- FastAPI
- Pydantic（データバリデーション）
- JWT（認証）
- Redis（キャッシュ、レート制限）

## 2.3 認証サービス

ユーザー認証と認可を処理し、セキュリティを管理します。

**主要機能:**
1. ユーザー認証（ユーザー名/パスワード、OAuth、OIDC）
2. JWTトークン生成と検証
3. ロールベースのアクセス制御（RBAC）
4. セッション管理

**技術スタック:**
- Python/FastAPI
- PyJWT
- OAuthLib
- Passlib（パスワードハッシュ）
- Redis（セッション管理）

## 2.4 ユーザー管理サービス

ユーザープロファイル、ロール、権限を管理します。

**主要機能:**
1. ユーザーの作成、読取、更新、削除（CRUD）
2. ロールと権限の管理
3. ユーザーグループの管理
4. ユーザー設定の保存

**データモデル:**
```
User {
    id: UUID
    username: String
    email: String
    hashed_password: String
    full_name: String
    is_active: Boolean
    created_at: DateTime
    updated_at: DateTime
    roles: Array<Role>
}

Role {
    id: UUID
    name: String
    permissions: Array<Permission>
}

Permission {
    id: UUID
    name: String
    resource: String
    action: String
}

UserGroup {
    id: UUID
    name: String
    users: Array<User>
}
```

**技術スタック:**
- Python/FastAPI
- SQLAlchemy ORM
- PostgreSQL

## 2.5 ドキュメント管理サービス

ドキュメントのアップロード、処理、管理を担当します。

**主要機能:**
1. ドキュメントアップロード
2. ドキュメント変換（多様な形式からテキスト抽出）
3. メタデータ抽出と管理
4. チャンク分割
5. インデックス管理

**ドキュメント処理パイプライン:**

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│            │    │            │    │            │    │            │
│ ドキュメント │───►│ テキスト抽出 │───►│ チャンク分割 │───►│ メタデータ  │
│ アップロード │    │            │    │            │    │  抽出     │
│            │    │            │    │            │    │            │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
                                                              │
┌────────────┐    ┌────────────┐    ┌────────────┐           │
│            │    │            │    │            │           │
│ ストレージ  │◄───│   インデックス │◄───│   ベクトル化  │◄──────────┘
│   保存     │    │            │    │            │
│            │    │            │    │            │
└────────────┘    └────────────┘    └────────────┘
```

**データモデル:**
```
Document {
    id: UUID
    title: String
    description: String
    file_name: String
    file_type: String
    file_size: Integer
    s3_path: String
    created_at: DateTime
    updated_at: DateTime
    created_by: User
    collection_id: UUID
    access_control: AccessControl
    metadata: JSON
    status: String
}

Collection {
    id: UUID
    name: String
    description: String
    owner: User
    documents: Array<Document>
    access_control: AccessControl
}

DocumentChunk {
    id: UUID
    document_id: UUID
    content: Text
    chunk_index: Integer
    metadata: JSON
    vector_id: String
}

AccessControl {
    id: UUID
    resource_id: UUID
    resource_type: String
    permissions: Array<PermissionAssignment>
}

PermissionAssignment {
    user_or_group_id: UUID
    is_group: Boolean
    permission: String
}
```

**技術スタック:**
- Python/FastAPI
- Celery（非同期処理）
- Redis（タスクキュー）
- NLTK/Spacy（テキスト処理）
- Unstructured（ドキュメント解析）
- PyPDF2/Docx2txt/Beautiful Soup（形式別パーサー）
- Boto3（S3操作）

## 2.6 RAGエンジンサービス

ドキュメント検索とLLM生成を統合するコアサービスです。

**主要機能:**
1. セマンティック検索
2. ハイブリッド検索（ベクトル + キーワード）
3. 検索結果のリランキング
4. プロンプト生成と管理
5. LLMとの統合
6. コンテキストウィンドウの最適化

**検索フロー:**
```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│            │    │            │    │            │    │            │
│ ユーザークエリ │───►│ クエリ埋め込み │───►│ ベクトル検索 │───►│ キーワード  │
│            │    │            │    │            │    │  検索     │
│            │    │            │    │            │    │            │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
                                                              │
┌────────────┐    ┌────────────┐    ┌────────────┐           │
│            │    │            │    │            │           │
│  LLM応答   │◄───│ プロンプト構成 │◄───│ 結果ランキング │◄──────────┘
│  生成      │    │            │    │            │
│            │    │            │    │            │
└────────────┘    └────────────┘    └────────────┘
```

**データモデル:**
```
SearchQuery {
    id: UUID
    user_id: UUID
    query_text: String
    collection_ids: Array<UUID>
    created_at: DateTime
    filters: JSON
}

SearchResult {
    id: UUID
    query_id: UUID
    chunks: Array<DocumentChunk>
    relevance_scores: Array<Float>
    response: String
    llm_model: String
    tokens_used: Integer
    created_at: DateTime
}

PromptTemplate {
    id: UUID
    name: String
    template: String
    description: String
    variables: Array<String>
    created_by: UUID
    created_at: DateTime
    updated_at: DateTime
}

Conversation {
    id: UUID
    user_id: UUID
    title: String
    created_at: DateTime
    updated_at: DateTime
    messages: Array<Message>
}

Message {
    id: UUID
    conversation_id: UUID
    role: String
    content: String
    created_at: DateTime
    referenced_chunks: Array<DocumentChunk>
}
```

**技術スタック:**
- Python/FastAPI
- Elasticsearch（ベクトル検索）
- OpenAI/Anthropic API（LLM）
- SentenceTransformers（埋め込みモデル）
- NumPy（ベクトル操作）
- Redis（キャッシュ）

## 2.7 LLMサービス

複数のLLMプロバイダーへの統一されたインターフェースを提供します。

**主要機能:**
1. LLMプロバイダー抽象化
2. トークン使用量の追跡
3. レスポンスストリーミング
4. フォールバック処理
5. プロンプトテンプレート管理

**サポートするLLMプロバイダー:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Mistral AI
- Llama 2/3
- ローカルLLM (オプション)

**技術スタック:**
- Python/FastAPI
- LangChain（LLM抽象化）
- SSE（Server-Sent Events、ストリーミング）
- Redis（キャッシュ）
