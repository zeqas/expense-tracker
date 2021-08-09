# 簡介
目的是能讓使用者紀錄支出

## 功能說明
### 

* 在首頁一次瀏覽所有支出的清單
* 在首頁看到所有支出清單的總金額
* 新增一筆支出
* 編輯支出的所有屬性 (一次只能編輯一筆)
* 刪除任何一筆支出 (一次只能刪除一筆)
* 在首頁可以根據支出「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和。

## v2.0 

### 新增功能

* 加入使用者認證功能
* 除了現在的資料，使用者可以在每筆支出加上「商家 (merchant)」這個欄位
* 在首頁，使用者可以同時根據「類別」與「月份」來篩選支出；總金額的計算只會包括被篩選出來的支出總和

---

## 環境建置
- 開發環境 Visual Studio Code v1.57.1
- 執行環境 Node.js v10.15.0
- 框架 Express.js v4.17.1
- 模板引擎 Express-handlebars v5.3.2
- 實用套件 Nodemon v2.0.7
- 重構套件 Method-override v3.0.0

---

## 安裝 

1. 在終端機輸入指令 Clone 此專案至電腦
```
git clone https://github.com/zeqas/expense-tracker.git
```
2. 進入專案目錄
```
cd expense-tracker
```
3. 安裝相關套件
```
npm install
```
4. 加入種子資料
```
npm run seed
```
5. 啟動專案
```
npm run dev
```
6. 出現以下訊息後，即可在 http://localhost:3000 開始使用
```
Express is listening on localhost:3000