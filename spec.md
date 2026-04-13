# サービス仕様書: Japan Disposal Guide

## 基本情報
- **サービス名:** Japan Disposal Guide
- **タグライン:** "How to get rid of anything in Japan — without getting fined."
- **対象ニーズ:** 日本在住外国人が粗大ゴミ・家具・家電の処分方法がわからない、中古品売買の選択肢を知らない
- **種類:** 静的サイト
- **デプロイ先:** GitHub Pages

### Redditエビデンス
- r/japanlife: "How do I get rid of all this furniture?" (2024)
- r/japanlife: "Second hand computer shopping" (2024)
- r/Osaka: "Recommendations on where to buy a second hand bicycle" (2024)

---

## 使うコード
- **URL:** 自作（該当リポなし）。処分ルールは自治体固有で既存リポなし
- **ライセンス:** MIT（自作）
- **CDN:** Tailwind CSS（UI）+ Fuse.js（ファジー検索）

---

## 核となる機能（1つだけ）

**処分したいモノを選ぶ → 処分方法と費用が一覧表示される**

---

## ページ構成

### メインページ (index.html) — 3セクション構成
1. **Search & Filter:** アイテム検索（Fuse.js）+ カテゴリフィルタ（Furniture / Appliances / Electronics / Bikes / Other）→ 処分方法カード表示
2. **Second-Hand Guide:** プラットフォーム一覧（Mercari, Yahoo Auctions, Jimoty, Hard Off, 2nd Street）の特徴・英語対応度・手数料
3. **How It Works:** 粗大ゴミ申込5ステップ、家電リサイクル法4品目、処分費用の相場レンジ

---

## データ設計

### items.json
```json
{ "items": [{
  "id": "sofa", "name": "Sofa / Couch", "category": "furniture",
  "disposal_methods": [
    { "method": "sodai_gomi", "label": "Bulk Waste (sodai gomi)",
      "cost_range": "400-2800", "currency": "JPY",
      "steps": ["Apply online/call city hall", "Buy sticker at konbini", "Place at designated spot"],
      "note": "Cost varies by city and item size" },
    { "method": "secondhand_sell", "label": "Sell Second-Hand",
      "platforms": ["mercari", "jimoty"], "note": "Free listing on Jimoty for local pickup" },
    { "method": "pickup_service", "label": "Paid Pickup Service",
      "cost_range": "3000-10000", "currency": "JPY",
      "note": "Same-day pickup from private haulers" }
  ],
  "recycling_law": false, "tags": ["couch", "loveseat", "sofa bed"]
}]}
```

### platforms.json
```json
{ "platforms": [{
  "id": "mercari", "name": "Mercari", "url": "https://jp.mercari.com/",
  "english_support": "app_only", "fee": "10% of sale price",
  "best_for": ["clothing", "electronics", "small items"], "affiliate_url": ""
}]}
```

---

## データ収集方針

**ダミーデータ禁止。以下の公式情報のみ使用。**

1. **粗大ゴミ費用:** 東京23区公式サイトの粗大ごみ受付ページから費用レンジを収集。特定区の金額ではなく一般的レンジとして表示
2. **家電リサイクル:** 経済産業省の家電リサイクル法ページから対象4品目・料金を取得
3. **中古プラットフォーム:** 各社公式サイトから手数料・サービス内容を確認
4. **初期アイテム数:** 20〜30品目（Reddit頻出: ソファ、冷蔵庫、洗濯機、自転車、PC、布団、本棚、エアコン等）

---

## プロジェクト構成
```
projects/japan-disposal-guide/
├── spec.md
├── index.html          ← メイン（HTML200行制限）
├── js/app.js           ← 検索・フィルタ・UI生成
├── js/data.js          ← items配列+platforms配列
├── css/style.css       ← Tailwind補助
├── data/items.json     ← 処分アイテムデータ
├── data/platforms.json ← 中古プラットフォームデータ
├── robots.txt
└── sitemap.xml
```

---

## 収益モデル
- **初期:** 無料公開（ユーザー獲得優先）
- **収益化:** Mercari・Yahoo Auctionsアフィリエイトリンク（利用可能になり次第）
- **具体的:** 各カードの「Sell on Mercari」「List on Jimoty」にアフィリエイトID付与
- **寄付:** Ko-fi + Buy Me a Coffee（既存アカウント流用）
- **将来:** 引越し業者・不用品回収業者の紹介アフィリエイト

---

## ビルド手順

1. `data/items.json` と `data/platforms.json` を公式情報から作成
2. `js/data.js` にJSONデータを配列として格納
3. `js/app.js` に検索・フィルタ・カード生成ロジック実装
4. `index.html` をTailwind CDN+Fuse.js CDNで構築（200行以内）
5. モバイル検証（viewport, 480px query, タップ44px+）
6. デプロイ: `https://github.com/humancronadmin/japan-disposal-guide` → GitHub Pages

---

## publish向け情報
- **サービスURL:** https://humancronadmin.github.io/japan-disposal-guide/
- **ターゲット:** 日本在住外国人（引越し・退去・断捨離時）
- **訴求:** "Moving out in Japan? Find out how to dispose of furniture, appliances, and everything else — costs, steps, and second-hand options."
- **投稿先:** r/japanlife, r/movingtojapan, r/Tokyo, r/Osaka, r/japanresidents
- **note切り口:** 「外国人が日本で粗大ゴミに困る問題をツール化した話」
- **SEO:** 既存Japan Expatツール群から相互リンク
