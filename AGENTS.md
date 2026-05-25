# AGENTS.md

## 프로젝트 개요

- 이 프로젝트는 전북현대모터스FC trading card 웹사이트다.
- 배포 목표는 GitHub Pages(`github.io`)이며, 정적 웹사이트로 구현한다.
- v1은 이승우 선수의 카드 3장을 완성한다.
- v1 첫 카드는 `이승우` 카드로 한다.
- 향후 다른 선수로 쉽게 바꿀 수 있도록 카드 데이터와 UI 구현을 분리한다.

## 권장 기술 스택

- 기본 스택은 `Vite + Svelte + TypeScript`로 한다.
- SvelteKit이 아니라 Vite Svelte 단일 페이지 앱을 우선한다.
- 빌드 결과는 정적 HTML/CSS/JS 산출물이어야 하며 GitHub Pages에 배포 가능해야 한다.
- 서버, DB, 인증, API가 필요한 구조는 v1 범위에서 제외한다.

## v1 구현 범위

- 첫 화면은 카드 자체가 중심이어야 한다.
- 카드 디자인, 홀로그램 효과, 애니메이션, 포인터 인터랙션을 구현한다.
- 모바일과 데스크톱 모두에서 자연스럽게 동작해야 한다.
- v1에서는 로그인, 결제, 서버 저장소, 실제 트레이딩 기능, 사용자 계정 기능을 만들지 않는다.
- 선수 교체는 데이터 변경만으로 가능해야 한다.

## 참고 사이트

- 카드 효과 참고: https://poke-holo.simey.me/
- 카드 구현 참고 저장소: https://github.com/simeydotme/pokemon-cards-css
- 전북현대모터스FC 공식 정보 참고: https://hyundai-motorsfc.com/
- 카드 효과는 `simeydotme/pokemon-cards-css`의 원본 CSS 변수, data attribute, shine/glare 레이어 구조를 기준으로 맞춘다.
- 클릭 확대/회전은 원본의 spring, CSS custom properties, translate/rotate 레이어 분리 방식을 우선 분석한다.

## 데이터 지침

- 카드 데이터는 UI 컴포넌트 안에 직접 하드코딩하지 않는다.
- 별도 데이터 파일이나 독립 객체로 관리한다.
- 특정 카드 정의 기준은 `docs/cardDefinition.md`를 따른다.
- 선수 데이터 수집과 stats 병합 기준은 `docs/playerDataCrawling.md`를 따른다.
- 최소 카드 필드는 다음을 기준으로 한다:
  - `playerName`
  - `title`
  - `seasonOrEra`
  - `position`
  - `image`
  - `stats`
- v1 데이터는 `cards.json`의 이승우 카드 3장을 기준으로 한다.

## 디자인 지침

- 자세한 디자인 기준은 `DESIGN.md`를 따른다.
- 카드 정의 추가/수정 기준은 `docs/cardDefinition.md`를 따른다.
- 카드 face theme 추가/수정 기준은 `docs/cardTheme.md`를 따른다.
- face theme 작업은 처음부터 Svelte face component를 추가/수정하고 Theme Lab Page에서 확인하는 `docs/cardTheme.md` 절차를 따른다.
- 전북현대모터스FC의 정체성이 느껴지도록 녹색 계열을 핵심 색으로 사용한다.
- 기본 색상 토큰은 `#00523D`, `#B7F700`, `#002E1C`, `#FFD200`이다.
- 전체 배경은 `poke-holo`처럼 어둡고 입체적인 무드로 만든다.
- v1 card face theme은 `framed-basic`, `full-art`, `video-art`다.
- 카드 디자인은 Svelte component 기반 face theme과 holo effect theme으로 분리한다.
- face theme은 offscreen DOM capture로 이미지화하며, 새 face 추가 시 범용 renderer를 수정하지 않는다.
- face theme은 `framed`와 `full-art` 종류를 구분하고, framed 계열은 `docs/cardTheme.md`의 `imageSurface` 기준을 따른다.
- 단색 위주의 밋밋한 화면이 되지 않도록 카드 프레임, 광택, 반사, 희귀도 표현을 적극 활용한다.
- 카드 비율은 실제 트레이딩 카드처럼 세로형을 기본으로 한다.
- 카드 효과는 보기 좋되 선수명과 스탯의 가독성을 해치면 안 된다.
- 공식 로고, 선수 사진, 구단 이미지 사용 전에는 권리와 출처를 확인한다.

## 구현 우선순위

1. Vite Svelte TypeScript 정적 앱 생성
2. 이승우 카드 데이터 정의
3. 카드 컴포넌트 구현
4. 홀로그램/포인터 인터랙션 구현
5. 반응형 스타일링
6. 정적 빌드와 GitHub Pages 배포 가능 여부 확인

## 완료 기준

- `npm run build` 결과물이 정적 배포 가능한 형태여야 한다.
- 카드 데이터와 카드 UI가 분리되어 있어야 한다.
- 다른 선수 카드로 바꾸기 위해 핵심 UI 코드를 수정하지 않아도 되어야 한다.
- `AGENTS.md`는 항상 100줄 이하를 유지한다.
