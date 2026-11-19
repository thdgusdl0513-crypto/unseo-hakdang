# 운서학당 · 雲書學堂

친구들과 함께 쓰는 동양풍 마법사 학교 온라인 서재.
GitHub에 올리고 Vercel로 배포하면 `○○.vercel.app` 주소로 함께 들어올 수 있어요.

## 들어 있는 파일

| 파일 | 하는 일 |
|---|---|
| `index.html` | 화면(메뉴, 타이머, 게시판, 출석도장, 입장 화면) |
| `core.js` `avatars.js` `spaces.js` | 3D 학당, 캐릭터, 계절 풍경 |
| `sound.js` | 자연의 소리, 정각 종, 피아노·재즈·왈츠 |
| `app.js` | 걷기, 기록, 대화, 닉네임, 자동 입장 |
| `cloud.js` | Firebase 연결(친구들과 함께 쓰기) |
| `firebase-config.js` | **내 Firebase 설정을 붙여 넣는 곳** |
| `database.rules.json` | Firebase 보안 규칙(콘솔에 붙여 넣기) |

`firebase-config.js`가 비어 있으면 혼자 모드로 동작해요. 기록은 각자 기기에만 저장돼요.

## 1. Firebase 준비 (무료)

1. https://console.firebase.google.com 에서 **프로젝트 추가** → 이름(예: `unseo-hakdang`) → Google 애널리틱스는 꺼도 됨 → 만들기
2. 왼쪽 **빌드 → Authentication → 시작하기 → 로그인 방법 → 익명 → 사용 설정 → 저장**
3. 왼쪽 **빌드 → Realtime Database → 데이터베이스 만들기**
   - 위치: **싱가포르(asia-southeast1)**
   - **잠금 모드로 시작** → 사용 설정
4. Realtime Database 화면의 **규칙** 탭에서 기존 내용을 지우고 `database.rules.json` 내용을 그대로 붙여 넣은 뒤 **게시**
5. 왼쪽 위 톱니바퀴 → **프로젝트 설정 → 내 앱 → 웹(`</>`) 아이콘** → 앱 닉네임 입력 → 앱 등록
6. 화면에 나오는 `firebaseConfig = { ... }`의 값을 `firebase-config.js`에 옮겨 적기
   - `databaseURL`이 없으면 Realtime Database 화면 맨 위의 주소(`https://…firebasedatabase.app`)를 넣어 주세요.
   - 이 값들은 비밀번호가 아니라 연결 주소라서 공개돼도 괜찮아요. 실제 보호는 4번의 보안 규칙이 해요.

## 2. GitHub에 올리기

1. GitHub에서 **New repository** → 이름(예: `unseo-hakdang`) → Create
2. **uploading an existing file**을 눌러 이 폴더의 파일을 모두 끌어다 놓고 **Commit changes**

## 3. Vercel로 배포

1. https://vercel.com 에 GitHub 계정으로 로그인 → **Add New… → Project**
2. 방금 만든 저장소 **Import** → Framework Preset은 **Other** 그대로 → **Deploy**
3. 생긴 주소(`https://○○.vercel.app`)를 친구들에게 보내기
4. (권장) Firebase **Authentication → 설정 → 승인된 도메인**에 그 vercel.app 주소 추가

## 업데이트할 때

- 바뀐 파일을 같은 GitHub 저장소에 다시 올리면(같은 이름으로 덮어쓰기) Vercel이 1분쯤 뒤 자동으로 다시 배포해요. **주소는 그대로**예요.
- `database.rules.json`이 바뀐 버전이면 Firebase **Realtime Database → 규칙**에도 새 내용을 붙여 넣고 **게시**해 주세요.
  (플레이리스트 버전부터 좋아요(♥)를 위한 `likes` 규칙이 추가됐어요.)

## 입장 암호

암호는 `homesweetreading`이에요.
- 화면에서 확인할 때는 코드 안에 암호 대신 암호를 변환한 값만 들어 있어요.
- 진짜 잠금은 Firebase 보안 규칙이 해요. 암호를 넣은 사람만 게시판, 기록, 대화를 읽고 쓸 수 있어요.
- 암호를 바꾸려면 `database.rules.json`의 `homesweetreading`(여러 군데)과 `app.js`의 `PWH` 값을 함께 바꿔야 해요.

## 알아 두기

- 닉네임과 기록은 기기(브라우저)마다 따로 기억돼요. 같은 사람이 다른 기기로 들어오면 새 학생으로 시작해요.
- 기숙사 대화는 접속한 사람끼리만 실시간으로 보이고, 지난 대화는 화면에 다시 불러오지 않아요.
- Firebase 무료 요금제(Spark)는 친구 몇 명이 쓰기에 충분해요.
