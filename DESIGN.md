# Design Guide

## 1. Design Goals

- 전북현대모터스FC trading card v1의 디자인 기준서다.
- v1 화면은 이승우 카드 3장을 각 카드의 기본 holo effect로 보여주는 정적 단일 페이지다.
- 첫 화면은 카드 자체가 주인공이어야 하며 랜딩 페이지처럼 구성하지 않는다.
- `poke-holo`처럼 어둡고 입체적인 배경 위에 카드가 떠 있는 느낌을 목표로 한다.
- 카드 디자인은 테마 시스템으로 설계해 다른 선수나 다른 카드 무드로 쉽게 확장한다.

## 2. Foundations

- 구조는 디자인 시스템 문서의 공통 패턴인 foundations, tokens, theme, component anatomy, motion, responsive, accessibility를 따른다.
- 참고 구조: Atlassian Foundations, Norton Foundations, Google Labs design.md spec.
- 구현 기준은 `Vite + Svelte + TypeScript` 정적 웹사이트에 맞춘다.
- 시각 요소는 CSS custom properties로 토큰화하는 것을 우선한다.

## 3. Brand Color Tokens

| Token | HEX | RGB | CMYK |
| --- | --- | --- | --- |
| `JEONBUK_GREEN` | `#00523D` | `0 82 61` | `91 57 84 27` |
| `YELLOW_GREEN` | `#B7F700` | `183 247 0` | `34 0 80 0` |
| `DARK_GREEN` | `#002E1C` | `0 46 28` | `94 71 84 56` |
| `YELLOW` | `#FFD200` | `255 210 0` | `5 22 89 0` |

Recommended CSS variables:

```css
:root {
  --jb-green: #00523d;
  --jb-yellow-green: #b7f700;
  --jb-dark-green: #002e1c;
  --jb-yellow: #ffd200;
}
```

## 4. Theme System

- 선수 데이터, card definition, card face theme, holo effect theme은 분리한다.
- Card face theme은 Svelte component로 구현하고, offscreen DOM capture를 통해 카드 앞면 이미지로 변환한다.
- Holo effect theme은 `pokemon-cards-css`의 shine/glare 레이어와 data attribute 매핑을 담당한다.
- 새 face theme을 추가할 때 `TradingCard` 효과 wrapper의 핵심 DOM 구조를 수정하지 않는다.
- 선수 데이터는 선수명, 포지션, 기본 stats를 담당하고 card definition은 카드별 이미지, special type, stat modifier를 담당한다.
- face theme은 표현만 담당하며 special type과 독립이다.

## 5. Default Face Themes

- v1 face theme은 `framed-basic`, `full-art`, `video-art`다.
- 배경과 프레임은 `DARK_GREEN`, `JEONBUK_GREEN`을 중심으로 한다.
- 하이라이트, foil, edge glow는 `YELLOW_GREEN`, `YELLOW`를 사용한다.
- 무드는 어두운 배경 위에서 녹색과 노란 반사가 살아나는 premium holo card다.
- 카드 표면은 깊은 녹색 베이스, 노란 광택, 옐로그린 스파크가 겹쳐지는 느낌으로 만든다.

## 6. Card Anatomy

- 카드 비율은 세로형 trading card를 기본으로 한다.
- 카드 구성은 frame, player visual area, name plate, metadata, stats, holographic overlay로 나눈다.
- 프레임은 두께감이 있어야 하며 모서리는 과하게 둥글지 않게 유지한다.
- 선수명과 핵심 정보는 홀로그램 효과 위에서도 항상 읽혀야 한다.
- 이미지가 준비되지 않은 경우에도 실루엣, 번호, 패턴으로 카드가 완성된 것처럼 보여야 한다.
- full-art 테마의 선수 이미지는 카드 비주얼 전체를 채우도록 cover + center 정렬을 기본으로 한다.

## 7. Holographic And Motion Effects

- `poke-holo`와 `simeydotme/pokemon-cards-css`의 카드 효과 구조를 기준으로 한다.
- `pokemon-cards-css` 원본 CSS/텍스처를 vendor로 두고, 우리 카드 DOM과 face theme에 맞게 wrapper를 조정한다.
- 포인터 위치를 CSS custom properties로 전달해 rotate, glare, shine/foil 레이어를 제어한다.
- glare와 shine은 원본 CSS의 data attribute 매핑과 blend/filter 계열 레이어를 따른다.
- 효과는 카드 정보의 가독성을 해치지 않는 범위에서만 강하게 만든다.

## 8. Interaction Rules

- 데스크톱에서는 포인터 이동에 따라 카드가 미세하게 회전하고 반사가 따라온다.
- 모바일에서는 터치/드래그 또는 느린 idle animation으로 대체한다.
- 카드 hover/focus 상태는 scale보다 빛, 그림자, tilt 변화로 표현한다.
- 인터랙션은 즉각적이어야 하지만 과하게 튀지 않아야 한다.
- `prefers-reduced-motion`에서는 강한 회전과 반복 애니메이션을 줄인다.

## 9. Responsive Rules

- 모바일에서도 카드가 첫 화면의 중심에 보여야 한다.
- 작은 화면에서는 부가 설명보다 카드 이미지, 선수명, 핵심 메타데이터를 우선한다.
- 카드 최대 너비를 제한해 데스크톱에서 지나치게 커지지 않게 한다.
- 터치 영역은 충분히 크게 잡고 hover에만 의존하지 않는다.

## 10. Accessibility Rules

- 텍스트 대비는 어두운 배경과 홀로그램 효과 위에서도 충분해야 한다.
- 색상만으로 정보나 희귀도를 전달하지 않는다.
- 포커스 상태는 시각적으로 분명해야 한다.
- 강한 플래시나 빠른 반복 반짝임을 만들지 않는다.
- 장식용 효과는 스크린리더 정보와 분리한다.

## 11. Implementation Notes

- 전북현대모터스FC 정보는 https://hyundai-motorsfc.com/ 를 기본 출처로 삼는다.
- 카드 효과 참고는 https://poke-holo.simey.me/ 를 사용한다.
- 공식 로고, 선수 사진, 구단 이미지는 사용 전 권리와 출처를 확인한다.
- GitHub Pages 배포를 고려해 정적 에셋과 정적 빌드 산출물만으로 동작해야 한다.
- face theme component, face theme registry, effect theme 데이터는 별도 파일로 분리한다.
- 새 face theme을 추가할 때 DOM capture renderer는 수정하지 않는다.
- 홈페이지는 `src/data/cards/cards.json`의 카드 3장을 카드별 기본 `effectThemeId`로 렌더링한다.
