# JBFC Cards Web

전북현대모터스FC trading card 웹사이트입니다. v1은 이승우 카드 3장을 각 카드의 기본 holo effect로 보여주는 정적 단일 페이지로 구현되어 있습니다.

## 기술 스택

- Vite
- Svelte
- TypeScript
- html-to-image + Playwright for build-time card face generation
- 정적 배포: GitHub Pages

## 실행 방법

```bash
npm install
npm run dev
```

루트 경로 배포를 기준으로 Vite `base`가 `/`로 설정되어 있습니다. 로컬 개발 서버에서도 다음 경로로 확인합니다.

```text
http://127.0.0.1:5173/
```

## 빌드

```bash
npm run build
npm run preview
```

`npm run build`는 `cards.json`의 모든 카드 앞면을 `public/generated/card-faces/*.png`로 먼저 렌더링하고,
`src/generated/cardFaces.ts` 매핑 파일을 갱신한 뒤 `svelte-check`, TypeScript 설정 검사, Vite 빌드를 실행합니다.

## 선수 데이터 관리

선수 데이터는 코드와 분리된 JSON 파일로 관리합니다.

```text
src/data/players/{season}-{playerName}-{kitNumber}.json
```

예시:

```text
src/data/players/2026-이승우-10.json
```

동명이인이나 시즌별 등번호 변경이 있어도 충돌하지 않도록 이 파일명 규칙을 유지합니다. Svelte 컴포넌트는 JSON을 직접 알지 않고 `src/data/playerCards.ts`를 통해 카드 데이터를 받습니다.

선수 `stats`는 단일 객체로 관리합니다. Dynamic Point 출처 값도 top-level `dynamicPoint`가 아니라 `stats`에 통합합니다. 수집/병합 규칙은 `docs/playerDataCrawling.md`를 참고합니다.

## 카드 정의 관리

전체 카드 목록은 단일 JSON 파일로 관리합니다.

```text
src/data/cards/cards.json
```

카드는 선수, face theme, 기본 holo effect, 선택 이미지, special type, stat modifier를 연결합니다. 이미지가 비어 있으면 선수 JSON의 `image`를 사용합니다. 자세한 기준은 `docs/cardDefinition.md`를 참고합니다.

선수 JSON, `cards.json`, face theme을 추가/수정한 뒤에는 다음 명령으로 카드 앞면 정적 이미지를 갱신합니다.

```bash
npm run generate:card-faces
```

## 디자인과 테마

디자인 기준은 `DESIGN.md`를 따릅니다.

- Card face theme: `framed-basic`, `full-art`, `video-art`
- 주요 색상: `#00523D`, `#B7F700`, `#002E1C`, `#FFD200`
- 카드 효과: 포인터 위치 기반 tilt, glare, shine/foil layer, 18개 holo effect theme
- 참고 효과: https://poke-holo.simey.me/
- 구현 참고 저장소: https://github.com/simeydotme/pokemon-cards-css

새 카드 앞면 테마는 Svelte component로 만든 뒤 `src/data/cardFaceThemes.ts`에 `component`와 effect surface를 등록합니다. `src/renderers/cardFaceRenderer.ts`는 build-time DOM 캡처 전용 범용 엔진이므로 새 테마를 추가해도 수정하지 않습니다. 자세한 기준은 `docs/cardTheme.md`를 참고합니다.

카드 테마 추가/수정은 처음부터 Svelte face component를 직접 만들거나 수정합니다. 구현 결과는 Theme Lab Page에서 query string으로 대상 face 하나만 띄워 확인합니다.

```text
http://127.0.0.1:5173/theme-lab?face=framed-basic
http://127.0.0.1:4173/theme-lab?face=framed-basic
http://127.0.0.1:4173/theme-lab?face=framed-basic&effect=regular-holo
```

Holo effect theme은 `src/data/cardEffects.ts`에서 관리합니다. 홈페이지는 카드 정의의 기본 `effectThemeId` 3개만 사용하고, Theme Lab에서는 18개 효과를 query string으로 확인할 수 있습니다. 효과 CSS와 텍스처는 `simeydotme/pokemon-cards-css`의 원본 구조를 기준으로 `src/styles/vendor/pokemon-cards-css`와 `public/img`에 맞춰 두었습니다.

## 데이터 출처

- 선수 프로필/기록: https://api.jbfc.kr/player/20220042
- 선수 이미지 원본: https://jbhd-upload-file.s3.ap-northeast-2.amazonaws.com/images/player/2026/20220042_280px.png
- Full Art 카드 이미지: `public/img/players/lee-seungwoo-2026-10-full-art.jpg`
- 카드 뒷면 엠블럼: https://hyundai-motorsfc.com/ 공식 사이트 에셋
- K LEAGUE Dynamic Point: https://www.kleague.com/record/dynamicPoint.do

현재 v1의 K LEAGUE Dynamic Point 값은 2026년 5월 25일 확인 기준의 정적 데이터입니다.

## 권리 주의

공식 로고, 선수 사진, 구단 이미지 등은 사용 전 권리와 출처를 확인해야 합니다. 현재 선수 이미지는 DOM 캡처 CORS 제약을 피하기 위해 공식 S3 원본을 정적 파일로 포함하고, 카드 뒷면 엠블럼은 공식 사이트의 2025 엠블럼 에셋을 정적 파일로 포함합니다.

## 다음 단계

- 선수 카드 추가
- 카드 face/effect 테마 개선
- GitHub Pages 배포 자동화
- 모바일 터치 인터랙션 세부 조정
