#!/usr/bin/env bash

git checkout cn
#git reset --hard
cp -R ../guide/zh ../guide/zh-copy

git checkout master
cp -R ../guide/zh-copy ../guide/
rm -rf ../guide/zh
mv ../guide/zh-copy ../guide/zh
git add ../guide/zh
git commit -m 'update cn'