# 使用 Nginx 作为基础镜像
FROM nginx:alpine

# 将本地的构建产物复制到 Nginx 的默认公开目录
COPY nginx.conf /etc/nginx
COPY www/ /usr/share/nginx/html

# 暴露 Nginx 默认端口
EXPOSE 8081

# Nginx 在容器启动时自动运行
CMD ["nginx", "-g", "daemon off;"]
