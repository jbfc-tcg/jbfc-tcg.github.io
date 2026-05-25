# Player Data Crawling Guide

## 목적

전북현대모터스FC 선수 데이터 JSON을 만들거나 갱신할 때 따르는 수집, 병합, 검증 규칙이다.

## 기본 출처

- 선수 기본 정보와 전북 소속 기록은 전북현대 공식 사이트와 공식 API를 우선한다.
- Dynamic Point 계열 값은 K LEAGUE 기록 페이지 또는 K리그 데이터 포탈을 보조 출처로 사용한다.
- 수집한 값은 정적 JSON에 저장하며, 런타임에서 외부 API를 호출하지 않는다.

## 파일 규칙

- 선수 데이터 파일명은 `src/data/players/{season}-{playerName}-{kitNumber}.json` 형식이다.
- 예: `src/data/players/2026-이승우-10.json`.
- JSON의 `id`는 URL과 파일명에 안전한 영문 id를 사용한다. 예: `2026-lee-seungwoo-10`.
- 이미지 경로는 DOM capture CORS 문제를 피하기 위해 `public/img/players` 아래 로컬 정적 에셋을 우선 사용한다.

## 필드 매핑

- 전북 공식 출처에서 우선 수집:
  - `playerName`, `playerNameEn`, `kitNumber`, `position`
  - `country`, `birthDate`, `heightCm`, `weightKg`
  - `seasonRecord.appearances`, `goals`, `assists`, `shots`, `shotsOnTarget`
  - 기본 선수 이미지 원본 URL과 로컬 저장 경로
- K LEAGUE / 데이터 포탈에서 보조 수집:
  - `stats.rank`, `stats.point`, `stats.attack`, `stats.pass`
  - `stats.defense`, `stats.defenseGoalkeeper`, `stats.goalkeeper`, `stats.etc`

## Stats 병합 규칙

- 최종 선수 JSON에는 top-level `dynamicPoint` 객체를 만들지 않는다.
- Dynamic Point 출처의 값도 모두 `stats` 객체 안에 저장한다.
- 전북 공식 출처 또는 수동 검증으로 이미 `stats`에 있는 값은 우선한다.
- K LEAGUE / 데이터 포탈 값은 `stats`에 없는 필드만 채운다.
- 같은 필드가 두 출처에 모두 있으면 기존 `stats` 값을 덮어쓰지 않는다.
- 값이 불확실하면 추정하지 말고 `sources`와 확인 날짜를 남긴 뒤 수동 검증한다.

## 수집 절차

1. 전북현대 공식 사이트 또는 공식 API에서 선수 프로필과 시즌 기록을 확인한다.
2. 선수 이미지를 로컬 `public/img/players`에 저장하고 JSON `image`를 로컬 경로로 둔다.
3. K LEAGUE 기록 페이지 또는 K리그 데이터 포탈에서 Dynamic Point 계열 값을 확인한다.
4. `stats`에 없는 필드만 Dynamic Point 값으로 채운다.
5. `sources.profile`, `sources.dynamicPoint`, `sources.image`에 원본 URL을 남긴다.
6. 수집 기준일을 README나 작업 로그에 남긴다.

## 수동 검증 체크리스트

- 등번호, 포지션, 키, 몸무게가 전북 공식 정보와 맞는가?
- 시즌 기록의 대회명과 시즌이 카드 시즌과 맞는가?
- `stats` 값이 숫자이며 문자열 콤마가 남아 있지 않은가?
- `dynamicPoint` top-level 필드가 남아 있지 않은가?
- 로컬 이미지가 루트 경로(`/img/...`)에서 접근 가능한가?
- 데이터 출처 URL이 `sources`에 남아 있는가?
