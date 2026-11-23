# 몽원학당 · 반려 친구 표시 안내

- 반려 친구 6종의 PNG 파일은 `assets/companions/characters/`에 있으며 선택 메뉴와 집중 타이머에 표시됩니다.
- 원본 `assets/companions/companion-animations.css`와 `focus-companions.css`가 기본·집중·휴식·일시정지·완료 애니메이션을 담당합니다.
- 기존 `pets.js`의 Three.js 반려 친구 모델은 **마당에 따라다니는 장면**에 그대로 사용합니다. GLB 파일이나 유료 서비스는 사용하지 않습니다.
- PNG 로드가 실패하면 기존 3D 캐릭터 썸네일로 자동 대체합니다. 캐릭터가 없어도 타이머는 정상 진행됩니다.
- 메인 캐릭터 8종 및 반려 친구 6종은 서로 별도 선택 목록으로 운영합니다.
- 타임스탬프 집중 타이머 및 Firebase 데이터 키는 그대로 유지합니다.
