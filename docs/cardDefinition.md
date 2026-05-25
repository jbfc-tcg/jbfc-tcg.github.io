# Card Definition Guide

## 목적

카드 정의는 선수 데이터, 카드 face theme, special type, 카드별 이미지/영상, 스탯 보정을 연결하는 데이터 계층이다.

## 현재 구조

- 전체 카드 목록은 `src/data/cards/cards.json` 단일 파일에서 관리한다.
- 선수 원본 데이터는 `src/data/players/{season}-{playerName}-{kitNumber}.json`에 둔다.
- `src/data/tradingCards.ts`가 카드 정의, 선수 데이터, face theme을 조합해 렌더링용 카드 목록을 만든다.
- 홈페이지는 이 목록의 카드들을 각각의 기본 `effectThemeId`로 렌더링한다.
- face theme은 카드의 시각 레이아웃만 담당하고, `specialType`과 독립이다.

## CardDefinition 필드

- `id`: 카드 고유 id다. 카드 목록 안에서 중복되면 안 된다.
- `playerId`: 연결할 선수 데이터 id다.
- `faceThemeId`: 적용할 face theme id다. 예: `framed-basic`, `full-art`, `video-art`.
- `effectThemeId`: 카드의 기본 holo effect id다. 예: `basic`, `trainer-gallery-holo`, `regular-holo`.
- `name`: 화면에 표시할 카드 이름이다.
- `specialType`: 선택 필드이며 `basic`, `player-of-the-month`, `goal-of-the-month`, `best-celebration`, `special-edition` 중 하나다.
- `image`: 선택 필드다. 비어 있거나 없으면 선수 데이터의 `image`를 사용한다.
- `imageAlt`: 선택 필드다. 비어 있거나 없으면 선수 데이터의 `imageAlt`를 사용한다.
- `video`: 선택 필드다. 카드와 연결할 하이라이트 영상 URL을 넣는다.
- `statModifiers`: 선택 필드이며 `stats` 숫자 필드에 더할 delta 값만 적는다.

## 이미지 규칙

- 카드별 이미지가 필요하면 `image`에 로컬 정적 에셋 경로를 넣는다.
- DOM capture CORS 문제를 피하기 위해 외부 URL을 직접 쓰지 말고 `public/img/players` 아래에 저장한다.
- 현재 이승우 Goal of the Month full-art 이미지는 `public/img/players/lee-seungwoo-2026-10-full-art.jpg`다.
- `image`가 없으면 선수 데이터의 기본 프로필 이미지를 사용한다.

## Video 규칙

- `video`는 카드와 연결된 하이라이트, 인터뷰, 경기 장면 등 외부 영상 URL이다.
- YouTube 링크는 일반 URL이나 공유 URL 모두 허용한다.
- 시작 시점이 중요하면 `t=153`처럼 query string에 포함한다.
- `video`는 카드 렌더링 필수값이 아니며, 없는 카드는 영상 동작을 제공하지 않는다.

## Effect Theme 규칙

- `effectThemeId`는 카드가 홈페이지에서 기본으로 사용할 holo effect다.
- effect id는 `src/data/cardEffects.ts`에 등록된 값과 일치해야 한다.
- `effectThemeId`가 없으면 `basic`을 기본값으로 사용한다.
- Theme Lab Page에서는 query string의 `effect` 값이 우선하며, 카드 기본 효과를 바꾸지 않는다.
- 현재 기본 매핑은 basic 카드 `basic`, Goal of the Month `trainer-gallery-holo`, Best Celebration `regular-holo`다.

## Stat Modifier 규칙

- `statModifiers`는 절대값이 아니라 delta다.
- 예: `"attack": 180`은 최종 attack을 180으로 설정하는 것이 아니라 원본 attack에 180을 더한다.
- 음수도 허용한다. 예: `"pass": -30`.
- 적용 대상은 선수 데이터의 `stats` 객체 숫자 필드다.
- 현재 Goal of the Month 예시는 `point +300`, `attack +180`, `etc +60`을 사용한다.

## Special Type 규칙

- `specialType`은 face theme과 별도다.
- 같은 `goal-of-the-month`라도 `framed-basic`이나 `full-art` 등 어떤 face theme에도 붙일 수 있다.
- `specialType`은 카드 의미와 배지를 위한 값이며, face theme을 자동으로 바꾸지 않는다.

## 확인 체크리스트

- 카드 id가 중복되지 않는가?
- `playerId`가 실제 선수 데이터 id와 일치하는가?
- `faceThemeId`가 실제 face theme id와 일치하는가?
- `effectThemeId`가 실제 effect theme id와 일치하는가?
- 카드별 이미지가 로컬 정적 에셋으로 존재하는가?
- `statModifiers` 값이 절대값이 아니라 delta로 작성되어 있는가?
