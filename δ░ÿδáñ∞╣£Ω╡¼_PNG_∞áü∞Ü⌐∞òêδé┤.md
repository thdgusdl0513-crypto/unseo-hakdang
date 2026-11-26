# 몽원학당 · PNG 반려 친구 6종 (집중 타이머)

- `index.html`에서 `focus-companions.css`, 원본 `companion-animations.css`를 로드합니다.
- 기존의 메인 아바타 (`ST.avatar`, `AVATARS`)와 반려 친구 (`ST.pet`, `PETS`)는 **분리**되어 있습니다.
- `focus-companions.js`는 집중 타이머 패널에서 6종을 선택/표시하고, 기존 `TM` 상태를 읽어 `idle/focus/rest/paused/success`에 연결합니다.
- **PNG로 전환한 여섯 친구는 Three.js 동반 펫 모델을 새로 생성하지 않습니다.** 다른 기존 펫은 기존 3D 방식을 유지합니다.
- 기존에 선택한 `jangseung-m`, `jangseung-f`는 둘 다 한 쌍이 그려진 `jangseung.png`로 보이며, 새 선택지 `jangseung`도 추가되었습니다.
- 기존 까치 ID `kkachi`는 `magpie.png`를 사용합니다.
- 원본 CSS는 `assets/companions/companion-animations.css`에 **변경 없이** 포함했습니다.
- 기존 타이머의 `startTime`, 완료 기록, 로컬 로그와 Firebase 관련 로직은 변경하지 않았습니다. 선택 반려 친구는 기존 `ST.pet` 데이터 경로를 사용합니다.
- 집중 화면: 타이머 시작 전=rest, 진행=focus, 일시정지=paused, 완료=success. 자리에서 일어난 상태=idle.
- 설치: 압축을 푼 뒤 파일과 폴더를 GitHub 저장소 최상위에 업로드하세요. `index.html`과 `assets/companions/` 경로를 함께 유지해야 합니다.
- 브라우저에서 전체 기능과 Firebase 실사용 계정 테스트는 배포 뒤 별도 확인이 필요합니다.
