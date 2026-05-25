# Card Theme Guide

## 목적

이 문서는 카드 face theme을 새로 추가하거나 수정할 때 따라야 할 구현 기준이다. 현재 구조는 `CardFaceTheme + build-time Svelte DOM capture renderer + holo effect theme` 조합이다.

## 현재 구조

- 카드 앞면은 Svelte component DOM으로 작성하고, 빌드 시점에 offscreen stage에서 정적 PNG로 캡처한다.
- face theme 정의는 `src/data/cardFaceThemes.ts`에서 관리한다.
- `src/renderers/cardFaceRenderer.ts`는 face component를 mount하고 이미지로 캡처하는 범용 엔진이다.
- `scripts/render-card-faces.mjs`가 `cards.json`의 모든 카드 앞면을 `public/generated/card-faces/*.png`로 생성한다.
- `src/generated/cardFaces.ts`는 생성된 PNG 경로 매핑이며 자동 생성 파일이다.
- `TradingCard.svelte`는 생성된 face 이미지를 보여주고, 클릭 확대/회전, pointer tilt, shine/glare 레이어만 담당한다.
- 영상 재생 버튼은 캡처 이미지가 아니라 `TradingCard.svelte`의 live overlay로 렌더링한다.
- face theme은 `kind: 'framed' | 'full-art'`로 종류를 구분한다.
- 현재 face theme은 `framed-basic`, `full-art`, `video-art`다.
- framed 계열은 `imageSurface`로 선수 사진 영역을 정의하고, holo 효과는 그 영역에서 생성한 `effectSurface`를 사용한다.

## Theme Lab Page

- 카드 테마 완성도 검수는 전용 페이지에서 한다.
- Theme Lab은 query string으로 지정한 face theme 하나만 출력한다.
- 로컬 URL 예시는 `http://127.0.0.1:5173/theme-lab?face=framed-basic`이다.
- preview URL 예시는 `http://127.0.0.1:4173/theme-lab?face=framed-basic`이다.
- `?view=theme-lab&face=framed-basic` 형태도 사용할 수 있다.
- 효과를 바꿔 보고 싶으면 `?effect=regular-holo`처럼 `effect` query를 추가한다.
- 테스트 페이지 컴포넌트는 `src/components/ThemeLab.svelte`다.
- 테스트 페이지는 설명 제목 없이 `[data-theme-lab-screenshot]` 영역에 카드 1장만 렌더링한다.
- `face` 값은 `src/data/cardFaceThemes.ts`에 등록된 `CardFaceTheme.id`와 일치해야 한다.
- `effect` 값은 `src/data/cardEffects.ts`에 등록된 `CardEffectTheme.id`와 일치해야 한다.
- `face`가 없거나 잘못되면 첫 번째 face theme을 사용하고, `effect`가 없거나 잘못되면 `basic` 효과를 사용한다.
- 스크린샷 대상 영역은 `[data-theme-lab-screenshot]`이다.
- 카드 테마 구현 후에는 홈페이지보다 이 페이지를 먼저 확인한다.

## 새 카드 테마 추가/수정 워크플로

1. 사용자가 카드 face theme 추가/수정을 요청하면 바로 Svelte face component를 추가하거나 수정한다.
2. face component는 `900 x 1257`, 카드 비율 `63 / 88` 기준의 고정 좌표로 작성한다.
3. 선수 사진은 별도 요청이 없으면 카드 정의나 선수 데이터에서 전달되는 `playerImage`를 사용한다.
4. framed 계열은 구현과 동시에 `imageSurface`를 실제 사진 DOM 영역과 같은 좌표로 맞춘다.
5. Theme Lab Page에서 `?face={theme-id}`로 해당 face 하나만 확인한다.
6. 필요하면 `?effect=regular-holo`, `?effect=reverse-holo`, `?effect=cosmos-holo` 등으로 효과 클립 정렬을 확인한다.
7. 사용자와 대화하며 face component와 `imageSurface`를 반복 수정한다.
8. 최종 확인 후 `npm run generate:card-faces` 또는 `npm run build`를 실행한다.

## 구현 절차

1. `src/components/card-faces`에 새 Svelte face component를 만든다.
2. `src/data/cardFaceThemes.ts`에 새 face theme 객체를 추가하고 `component`에 해당 component를 등록한다.
3. 카드 종류를 `kind: 'framed'` 또는 `kind: 'full-art'`로 명시한다.
4. framed 계열이면 `imageSurface`를 반드시 정의하고, `framedEffectSurface(imageSurface)`로 `effectSurface`를 만든다.
5. full-art 계열이면 기본적으로 `inset(0 round 18px)`를 사용한다.
6. 영상 버튼 모양을 테마별로 바꾸려면 `videoButtonComponent`에 별도 Svelte component를 등록한다.
7. `src/renderers/cardFaceRenderer.ts`는 build-time 캡처 엔진이므로 수정하지 않는다.
8. 카드별 선수 이미지나 영상이 필요하면 `docs/cardDefinition.md`의 `image`, `video` 규칙을 따른다.
9. 캡처 기준 크기 `900 x 1257`과 카드 비율 `63 / 88`은 유지한다.
10. Theme Lab Page에서 대상 face를 먼저 확인한다.
11. `npm run build`와 브라우저 확인으로 전체 카드가 모두 생성된 image face로 렌더링되는지 확인한다.

## 좌표 기준

- face component 좌표계는 `900 x 1257` 픽셀이다.
- `imageSurface`는 이 좌표계 기준 선수 사진 영역이며 `{ x, y, width, height, radius, borderOutset }` 형태다.
- `effectSurface`는 CSS `clip-path` 문자열이며, framed 계열에서는 `imageSurface`에서 자동 생성해야 한다.
- 특정 영역이 `(x, y, width, height)`일 때 CSS inset 값은 다음과 같이 계산한다.

```text
top = y / 1257 * 100
right = (900 - x - width) / 900 * 100
bottom = (1257 - y - height) / 1257 * 100
left = x / 900 * 100
```

- 퍼센트 값은 소수 둘째 자리까지 반올림해도 된다.
- `clipBorders`는 `imageSurface.borderOutset`만큼 바깥쪽으로 넓혀 생성한다.

## Framed Theme 주의사항

- framed 계열 테마는 선수 사진 영역과 특수효과 네모 박스가 정확히 겹쳐야 한다.
- 선수 사진 영역은 `imageSurface`와 face component의 사진 DOM 영역에 같은 좌표로 정의한다.
- `src/renderers/cardFaceRenderer.ts`에 특정 face id 조건을 추가하지 않는다.
- 선수 사진 영역을 수정할 때 `effectSurface` 문자열을 손으로 따로 수정하지 않는다.
- `clip`, `clipInvert`, `clipStage`, `clipStageInvert`, `clipTrainer`, `clipTrainerInvert`는 모두 같은 `imageSurface` 좌표에서 생성되어야 한다.
- `clipBorders`는 같은 `imageSurface`를 기준으로 하되, 사진 프레임보다 아주 살짝 크게 생성한다.
- `imageSurface.radius`와 특수효과 clip의 `round` 값은 시각적으로 같아야 한다.
- 현재 `framed-basic` 선수 사진 영역은 face 좌표계 기준 `x=66, y=146, width=768, height=486`이다.
- 현재 `framed-basic` radius는 `10`, borderOutset은 `3`이다.
- 현재 `framed-basic` clip은 `imageSurface`에서 자동 생성된다.
- 사진 영역을 키우거나 이동한 뒤에는 브라우저에서 regular holo, reverse holo, cosmos holo를 우선 확인한다.

## Full Art Theme 주의사항

- full-art 계열은 특수효과가 카드 전체에 적용되는 것이 기본이다.
- 현재 full-art clip은 `inset(0 round 18px)`이다.
- `video-art`처럼 영상 중심 테마도 full-art 계열로 등록할 수 있다.
- full-art에서 일부 영역만 효과를 적용하려면 의도적으로 그렇게 하는지 문서와 코드 주석에 남긴다.
- full-art는 선수 이미지가 카드 전체 비주얼의 일부이므로 사진 프레임 clip에 의존하지 않는다.
- full-art 선수 이미지는 stage 전체를 `object-fit: cover`, `object-position: center center`로 채우는 것을 기본으로 한다.

## Build-Time Capture Renderer 규칙

- renderer는 `faceTheme.component`를 화면 밖 hidden wrapper 안의 capture stage에 mount한 뒤 `html-to-image`로 PNG를 만든다.
- 생성 스크립트는 Playwright로 Vite generator page를 열어 브라우저 캡처를 수행한다.
- 생성된 파일은 `public/generated/card-faces/{card-id}.png`에 저장한다.
- 카드 목록, 선수 데이터, face theme을 수정한 뒤에는 `npm run generate:card-faces` 또는 `npm run build`를 실행한다.
- renderer는 특정 face theme id, layout, 사진 좌표를 알면 안 된다.
- 외부 이미지를 캡처하면 CORS 때문에 실패할 수 있으므로 선수 이미지는 `public/img/players`에 로컬 정적 에셋으로 둔다.
- face component는 `playerImage.src`와 `playerImage.alt`를 사용하고, 선수 데이터의 `image`를 직접 참조하지 않는다.
- face component CSS는 `900 x 1257` 고정 좌표를 기준으로 작성하고 `cqw`를 사용하지 않는다.
- 긴 텍스트는 component 안에서 고정 폭, `white-space`, `overflow`, `text-overflow` 등으로 영역 안에 맞춘다.
- 카드 안의 모든 텍스트는 생성된 이미지의 일부가 되어야 하며, `.card__front`에 live text DOM을 다시 넣지 않는다.

## Video Interaction 규칙

- 카드 정의에 `video`가 있으면 카드 위에 영상 재생 버튼을 띄울 수 있다.
- face component 내부에 `<button>`을 넣어도 캡처 이미지가 되므로 실제 인터랙션이 되지 않는다.
- 영상 버튼은 `CardFaceTheme.videoButtonComponent`로 등록한다.
- 버튼 component는 `CardVideoButtonProps`를 받으며 `onPlay()`를 호출해 재생 모달을 연다.
- 테마별 버튼 위치와 스타일은 각 `card-actions/*VideoButton.svelte`에서 관리한다.
- `video-art`처럼 재생이 핵심인 테마는 중앙 아이콘 버튼을 live overlay로 두고, face component에는 버튼 이미지를 그리지 않는다.
- YouTube 링크는 `TradingCard.svelte`에서 `youtube-nocookie.com/embed/...` 형식으로 변환해 iframe으로 재생한다.

## 확인 체크리스트

- Theme Lab Page에서 `?face={theme-id}`로 대상 테마 하나만 확인했는가?
- 필요하면 `?effect={effect-id}`를 바꿔 effect surface 정렬을 확인했는가?
- `.card__front img.card-face-image`가 전체 카드 수만큼 렌더링되는가?
- `.card__front article.card-face` 같은 이전 DOM face가 남아 있지 않은가?
- framed 계열에서 선수 사진 프레임과 특수효과 네모 박스가 정확히 겹치는가?
- framed 계열에서 사진 프레임 radius와 특수효과 clip radius가 어긋나 보이지 않는가?
- full-art 계열에서 효과가 카드 전체에 자연스럽게 적용되는가?
- `video`가 있는 카드에서 테마별 재생 버튼이 보이고 iframe 모달이 열리는가?
- 클릭 확대/회전, pointer tilt, 뒷면 표시가 기존처럼 동작하는가?
- 모바일 폭에서도 face 이미지가 비율대로 축소되고 텍스트 줄바꿈 문제가 없는가?
