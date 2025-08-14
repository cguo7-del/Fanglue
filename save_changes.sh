#!/bin/bash

# 保存代码变更到本地和Git仓库的脚本

# 显示帮助信息
show_help() {
    echo "使用方法: ./save_changes.sh [选项] <提交信息>"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -b, --backup   指定本地备份目录 (默认: ~/Desktop/fanglue_backup)"
    echo "  -m, --message  Git提交信息 (必需)"
    echo ""
    echo "示例:"
    echo "  ./save_changes.sh -m \"添加新功能\""
    echo "  ./save_changes.sh -b ~/my_backups -m \"修复bug\""
}

# 默认备份目录
BACKUP_DIR="$HOME/Desktop/fanglue_backup"
COMMIT_MESSAGE=""

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -b|--backup)
            BACKUP_DIR="$2"
            shift 2
            ;;
        -m|--message)
            COMMIT_MESSAGE="$2"
            shift 2
            ;;
        *)
            if [[ -z "$COMMIT_MESSAGE" ]]; then
                COMMIT_MESSAGE="$1"
            else
                echo "错误: 未知参数 $1"
                show_help
                exit 1
            fi
            shift
            ;;
    esac
done

# 检查提交信息是否提供
if [[ -z "$COMMIT_MESSAGE" ]]; then
    echo "错误: 必须提供提交信息"
    show_help
    exit 1
fi

# 确保备份目录存在
if [[ ! -d "$BACKUP_DIR" ]]; then
    echo "创建备份目录: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# 获取当前日期时间作为备份标识
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_SUBDIR="$BACKUP_DIR/${TIMESTAMP}_${COMMIT_MESSAGE//[^a-zA-Z0-9]/_}"

# 创建备份子目录
mkdir -p "$BACKUP_SUBDIR"

# 复制当前项目到备份目录
echo "正在备份项目到: $BACKUP_SUBDIR"
cp -R . "$BACKUP_SUBDIR"

# 检查Git仓库目录是否存在
GIT_REPO_DIR="$PWD/Fanglue"
if [[ ! -d "$GIT_REPO_DIR" ]]; then
    echo "错误: Git仓库目录不存在: $GIT_REPO_DIR"
    exit 1
fi

# 切换到Git仓库目录
cd "$GIT_REPO_DIR"

# 检查是否在Git仓库中
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "错误: 当前目录不是Git仓库"
    exit 1
fi

# 添加所有更改到Git
echo "添加更改到Git..."
git add .

# 提交更改
echo "提交更改: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# 推送到远程仓库
echo "推送到远程仓库..."
git push origin main

echo "完成! 更改已保存到本地备份和Git仓库。"
echo "本地备份位置: $BACKUP_SUBDIR"