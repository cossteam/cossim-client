# 使用 Node.js 作为基础镜像
FROM node:20 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install --registry http://registry.npmmirror.com

# 复制项目文件到工作目录
COPY . .

# 构建项目
RUN npm run build

# 使用 Nginx 作为基础镜像来托管构建的静态文件
FROM nginx:stable-alpine

# 删除默认的 Nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 从构建阶段复制生成的静态文件到 Nginx 的静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
