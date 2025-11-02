#! /bin/bash
#build for dev or production

date
mv .env.local dist.env.local
mv .env.dist.prod.local .env.prod.local
sleep 1

echo `pwd`
npm run build

mv dist.env.local .env.local
mv .env.prod.local .env.dist.prod.local
date