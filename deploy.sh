#!/bin/bash
# 一键部署：构建并同步到 wwling.cn/lisheng/（主地址）+ github.io（备用地址）
set -e
export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897
cd "$(dirname "$0")"

npm run build

# 主地址 wwling.cn/lisheng/
SITE=/tmp/wanwuling-ai-site
if [ ! -d "$SITE/.git" ]; then
  git clone --depth 1 https://github.com/Chilled-watermelon/wanwuling-ai-site.git "$SITE"
fi
cd "$SITE" && git pull -q origin main
rm -rf lisheng && mkdir lisheng && cp -r "$OLDPWD/dist/"* lisheng/
git add -A
git -c user.name="Chilled-watermelon" -c user.email="chilled-watermelon@users.noreply.github.com" \
  commit -q -m "chore: update lisheng demo $(date +%F_%H%M)" || echo "no changes"
git push -q origin main
cd "$OLDPWD"

# 备用地址 github.io
npx -y gh-pages -d dist -u "Chilled-watermelon <chilled-watermelon@users.noreply.github.com>"

echo ""
echo "部署完成："
echo "  主地址  http://wwling.cn/lisheng/"
echo "  备用    https://chilled-watermelon.github.io/lisheng-agent-demo/"
