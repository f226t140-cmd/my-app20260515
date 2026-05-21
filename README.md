# まちがいさがしアプリ (Spot the Difference)

HTML, CSS, JavaScript で作成したシンプルな「まちがいさがし」ゲームです。GitHub Pages で簡単に公開できるように設計されています。

## プロジェクトURL
[https://github.com/f226t140-cmd/my-app20260515](https://github.com/f226t140-cmd/my-app20260515)

## 遊び方
1. ゲームを開始すると、左右に2枚の画像が表示されます。
2. 左右の画像を比較して、違う場所を見つけたらクリックしてください。
3. 正解すると、両方の画像に赤い丸が表示され、スコアが加算されます。
4. 間違った場所をクリックすると、画面が揺れるエフェクトが発生します。
5. 60秒以内にすべての間違い（デフォルトでは5つ）を見つけるとゲームクリアです！
6. 「リセット」ボタンでいつでも最初からやり直せます。

## カスタマイズ方法

### 1. 画像を変更する
`index.html` の `<img>` タグの `src` 属性を、ご自身で用意した画像のパスに変更してください。
```html
<img src="assets/your-image-1.jpg" alt="画像1" id="img-1">
<img src="assets/your-image-2.jpg" alt="画像2" id="img-2">
```

### 2. 間違いの場所を設定する
`script.js` の冒頭にある `differences` 配列を編集します。
- `x`: 画像の左端からの位置（0〜100%）
- `y`: 画像の上端からの位置（0〜100%）

```javascript
const differences = [
    { x: 25, y: 40, found: false },
    { x: 60, y: 20, found: false },
    // 必要な数だけ追加
];
```

### 3. 制限時間を変更する
`script.js` の `timeLeft` 変数の値を変更することで、制限時間を調整できます。

## デプロイ方法 (GitHub Pages)
1. GitHub リポジトリの **Settings** > **Pages** を開きます。
2. **Branch** を `main` に設定して **Save** をクリックします。
3. 数分後、サイトが公開されます。

## ライセンス
MIT License
