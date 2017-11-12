# Rollupjs.org

This is the source code for the website!

## Steps to build the website locally

1. `npm install`
2. `npm run prep`
3. `npm run dev`
4. Open up http://localhost:3001


## 分支对比
1. 在 cn 分支的 en 文件夹下进行翻译。这样才能对比 cn 分支和 master 分支 en 文件夹下文件的差异。

## 合并方案
分为三个仓库：英文仓库、中文仓库、我的仓库
1. 第一步：英文仓库 master 分支向中文仓库 master 分支合并以及提交(merge & push)。
2. 第二步：中文仓库 master 分支向我的仓库 master 分支合并以及提交(merge & push)。
3. 第三步：我的仓库 master 分支向我的仓库 cn 分支合并以及提交(merge & push)。
4. 第四步：我的仓库 cn 分支向中文仓库 cn 分支提交 pr。
5. 第五步：中文仓库 cn 分支合并(merge) 我的仓库 cn 分支的 pr。
6. 第六步：中文仓库 cn 分支将 en 文件夹下的文件，复制到中文仓库 master 分支 zh 文件夹。
7. 第七步：中文仓库 master 分支向英文仓库 master 分支提交 pr。

## Adding translations

Translations into other languages are warmly welcomed. Make a copy of the `guide/en` directory, renaming it to your language (e.g. `guide/fr`), and update the markdown files inside. Once done, the translation will be available at `/[lang]`.
