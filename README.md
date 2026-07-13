# 오늘의 기록 · Done List

모바일 우선으로 만든 개인용 "오늘 한 일 기록" 웹앱입니다. 별도 서버나 로그인 없이 브라우저의
`localStorage`에 데이터를 저장하며, 정적 파일만으로 동작하므로 GitHub + Vercel 조합으로 바로
배포할 수 있습니다.

## 주요 기능

- **홈**: 오늘 날짜 기준 화면. 좌우 화살표로 날짜 이동(오늘 이후는 이동 불가), `+` 버튼으로 항목 추가
- **항목(d-i) 등록**: 이름 / 작업시간(10분 단위) / 색상(기본 올리브) / 시작시간(HH:mm), 등록된
  고정루틴에서 선택하거나 직접 입력 가능
- **주간현황**: 한 주를 요일별 블록 캘린더로 표시, 각 날짜 안에서 시작시간순 정렬
- **한달현황**: 이번 달 고정루틴별 총 작업시간 합계
- **루틴등록**: 반복 사용하는 항목(이름/단위시간/색상)을 고정루틴으로 등록·수정·삭제
- **설정**: 데이터 JSON 내보내기/가져오기, 전체 초기화

## 기술 스택

- 순수 HTML / JavaScript(ES Modules), 빌드 도구 없음
- Tailwind CSS (CDN, Play CDN 방식)
- 데이터 저장: 브라우저 `localStorage` (기기별로 독립적으로 저장되며 서버로 전송되지 않음)

## 로컬에서 확인하기

정적 파일이라 별도 빌드가 필요 없습니다. 아무 정적 서버로 열어보면 됩니다.

```bash
# 프로젝트 루트에서
npx serve .
# 또는
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` (또는 `serve`가 알려주는 주소) 접속 후,
모바일 화면 폭(개발자 도구의 기기 툴바)으로 보는 것을 권장합니다.

## GitHub에 올리기

```bash
cd donelist
git init
git add .
git commit -m "Init: 오늘의 기록 done-list"
git branch -M main
git remote add origin https://github.com/<your-id>/<repo-name>.git
git push -u origin main
```

## Vercel로 배포하기

1. [vercel.com](https://vercel.com) 로그인 후 **Add New → Project**
2. 방금 올린 GitHub 저장소를 선택(Import)
3. Framework Preset은 **Other**(정적 사이트)로 자동/수동 설정, Build Command와 Output
   Directory는 비워둡니다 (별도 빌드가 없는 순수 정적 프로젝트이기 때문입니다)
4. **Deploy** 클릭 → 완료되면 `https://<project>.vercel.app` 주소로 접속 가능

이후 GitHub `main` 브랜치에 푸시할 때마다 Vercel이 자동으로 재배포합니다.

## 데이터에 대한 참고

- 모든 데이터는 접속한 브라우저의 `localStorage`에만 저장됩니다. 기기를 바꾸거나
  브라우저 데이터를 지우면 사라지므로, 설정 화면의 **데이터 내보내기**로 주기적으로
  JSON 백업을 받아두는 것을 권장합니다.
- 여러 기기에서 같은 기록을 보려면 별도의 서버/동기화 기능이 필요하며, 현재 버전에는
  포함되어 있지 않습니다.

## 폴더 구조

```
donelist/
├─ index.html            # 앱 진입점, Tailwind 설정 포함
├─ js/
│  ├─ main.js             # 상태 관리 · 라우팅 · 이벤트 위임
│  ├─ store.js             # localStorage 데이터 레이어
│  ├─ utils.js              # 날짜/시간 포맷 유틸
│  ├─ header.js              # 상단 바 + 펼침 메뉴
│  ├─ modals.js               # 항목/루틴 등록·수정 바텀시트
│  └─ views/
│     ├─ home.js               # 홈(오늘 날짜) 화면
│     ├─ weekly.js              # 주간현황
│     ├─ monthly.js              # 한달현황
│     ├─ routines.js              # 루틴등록
│     └─ settings.js              # 설정
└─ README.md
```
