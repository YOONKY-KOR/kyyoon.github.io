# KY's Blog

Hugo + PaperMod 테마 기반 기술 블로그

- **사이트**: https://yoonky-kor.github.io/
- **테마**: [PaperMod](https://github.com/adityatelange/hugo-PaperMod)
- **댓글**: Giscus (GitHub Discussions)

## 구조

```
yoonky-kor.github.io/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Hugo 빌드 & GitHub Pages 배포
│       └── notion-sync.yml     # Notion 자동 동기화
├── archetypes/
│   ├── default.md              # 기본 frontmatter 템플릿
│   └── posts.md                # 포스트 전용 템플릿
├── assets/                     # 커스텀 CSS/JS
├── content/
│   ├── _index.md               # 홈 페이지
│   ├── about.md                # About 페이지
│   ├── archives.md             # 아카이브 페이지
│   ├── search.md               # 검색 페이지
│   ├── posts/                  # 일반 블로그 포스트
│   ├── ai/                     # AI 카테고리
│   ├── architecture/           # Architecture 카테고리
│   └── azure/                  # Azure 카테고리
├── layouts/                    # 커스텀 Hugo 레이아웃
├── scripts/
│   ├── notion-sync.js          # Notion → Hugo 동기화 스크립트
│   └── package.json            # 패키지 설정
├── static/                     # 정적 파일 (favicon, 이미지 등)
├── themes/
│   └── PaperMod/               # PaperMod 테마 (submodule)
└── hugo.toml                   # Hugo 설정
```

## 메뉴 구조

| 메뉴 | URL |
|------|-----|
| About | `/about/` |
| Blog | `/posts/` |
| Categories > AI | `/ai/` |
| Categories > Architecture | `/architecture/` |
| Categories > Azure | `/azure/` |
| Search | `/search/` |
| Archives | `/archives/` |

## 배포

`main` 브랜치에 push 시 GitHub Actions가 자동으로 Hugo 빌드 후 GitHub Pages에 배포합니다.

## Notion 동기화

### 설정

GitHub 저장소 Settings > Secrets and variables > Actions에 다음 시크릿 추가:

| 시크릿 | 설명 |
|--------|------|
| `NOTION_TOKEN` | Notion Integration Token |
| `NOTION_DATABASE_ID` | 동기화할 Notion 데이터베이스 ID |

### Notion 데이터베이스 속성

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | Title | 포스트 제목 |
| Slug | Rich Text | URL 슬러그 (영문) |
| Date | Date | 발행일 |
| Status | Select | `Published` 상태인 항목만 동기화 |
| Tags | Multi-select | 태그 |
| Categories | Multi-select | 카테고리 (`posts` / `ai` / `architecture` / `azure`) |
| Description | Rich Text | 포스트 설명 |

### 수동 실행

GitHub Actions > Notion Sync > Run workflow

## Giscus 댓글

GitHub Discussions 기반 댓글 시스템입니다. 설정은 `hugo.toml`의 `[params.giscus]` 섹션에서 관리합니다.

- **저장소**: `YOONKY-KOR/yoonky-kor.github.io`
- **연결 방식**: `pathname` (URL 경로 기준)
- **테마**: 시스템 다크/라이트 자동 적용

## 로컬 개발

```bash
# Hugo 서버 실행
hugo server -D

# 새 포스트 생성
hugo new posts/my-post.md

# 카테고리별 포스트 생성
hugo new azure/my-azure-post.md
hugo new ai/my-ai-post.md
hugo new architecture/my-arch-post.md
```
